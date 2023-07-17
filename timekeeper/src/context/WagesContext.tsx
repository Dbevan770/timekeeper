import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
  ReactNode,
} from "react";
import {
  GetFilteredWages,
  WageObjectProps,
  CreateWageProps,
  DateRangeQuery,
  CreateWage,
  UpdateWage,
  DeleteWage,
} from "../database/database";
import { Timestamp } from "firebase/firestore";
import { useAuthContext } from "./AuthContext";
import { v4 as uuidv4 } from "uuid";
import { convertToCreateWageProps } from "../utils/convertData";

interface WagesContextType {
  wages: WageObjectProps[];
  isLoadingWages: boolean;
  refreshWages: () => Promise<void>;
  addWage: (
    wage: CreateWageProps
  ) => Promise<{ success: boolean; msg: string }>;
  deleteWage: (docId: string) => Promise<boolean>;
  setDateRange: (dateRangeQuery: DateRangeQuery) => void;
  undoDelete: () => Promise<boolean>;
  updateWage: (
    wage: WageObjectProps
  ) => Promise<{ success: boolean; msg: string }>;
}

const WagesContext = createContext<WagesContextType | undefined>(undefined);

export const useWages = (): WagesContextType => {
  const context = useContext(WagesContext);
  if (!context) {
    throw new Error("useWages must be used within a WagesProvider");
  }
  return context;
};

const sortWages = (wages: WageObjectProps[]) => {
  return wages.sort((a, b) => b.shiftDate.toMillis() - a.shiftDate.toMillis());
};

export const WagesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const [isLoadingWages, setIsLoadingWages] = useState<boolean>(false);
  const [lastDeletedWage, setLastDeletedWage] = useState<WageObjectProps>();
  const [dateRangeQuery, setDateRangeQuery] = useState<DateRangeQuery>({
    queryType: "currentWeek",
  });
  const [wages, setWages] = useState<WageObjectProps[]>([]);

  const getWages = useCallback(async () => {
    setIsLoadingWages(true);
    let result;

    if (user) {
      result = await GetFilteredWages(user, dateRangeQuery);

      if (result.success && result.data) {
        result.data.sort(
          (a, b) => b.shiftDate.toMillis() - a.shiftDate.toMillis()
        );
        setWages(result.data);
      }
    }
    setIsLoadingWages(false);
  }, [user, dateRangeQuery]);

  useEffect(() => {
    getWages();
  }, [getWages]);

  interface WageWithDocId extends Omit<CreateWageProps, "shiftDate"> {
    docId: string;
    shiftDate: Timestamp;
  }

  const addWage = async (wage: CreateWageProps) => {
    const tempId = uuidv4();
    const tempWage: WageWithDocId = {
      docId: tempId,
      ...wage,
      shiftDate: Timestamp.fromDate(wage.shiftDate),
    };
    // Optimistically update the state.
    setWages((prevWages) => sortWages([...prevWages, tempWage]));

    try {
      const newWage = await CreateWage(user, wage);
      if (!newWage.success) {
        return { success: false, msg: newWage.error || "An error occurred." };
      } else if (newWage.success && newWage.data) {
        const newWageData = newWage.data[0];
        setWages((prevWages) =>
          sortWages(
            prevWages.map((prevWage) =>
              prevWage.docId === tempId ? newWageData : prevWage
            )
          )
        );
        return { success: true, msg: "Save successful" };
      } else {
        return {
          success: false,
          msg: "Operation successful but no data returned.",
        };
      }
    } catch (err) {
      setWages((prevWages) =>
        sortWages(prevWages.filter((prevWage) => prevWage.docId !== tempId))
      );

      return { success: false, msg: "Operation to save data failed." };
    }
  };

  const deleteWage = async (docId: string) => {
    if (user) {
      const wageToBeDeleted = wages.find((wage) => wage.docId === docId);
      if (!wageToBeDeleted) {
        console.log(`No wage found with docId: ${docId}`);
        return false;
      }

      // Set the item marked for deletion to last deleted item for potential to undo
      // this action. Also optimistically remove marked item from local state before
      // attempting to delete it from the database.
      setLastDeletedWage(wageToBeDeleted);
      setWages((prevWages) => prevWages.filter((wage) => wage.docId !== docId));

      try {
        await DeleteWage(user, docId);
        return true;
      } catch (err) {
        setWages((prevWages) => sortWages([...prevWages, wageToBeDeleted]));
        setLastDeletedWage(undefined);
        return false;
      }
    }
    return false;
  };

  const undoDelete = async () => {
    if (lastDeletedWage !== undefined && user !== null) {
      const convertedWage = convertToCreateWageProps(lastDeletedWage);
      const response = await addWage(convertedWage);
      if (response?.success) {
        setLastDeletedWage(undefined);
        return true;
      } else {
        return false;
      }
    }

    return false;
  };

  const setDateRange = (newDateRangeQuery: DateRangeQuery) => {
    setDateRangeQuery(newDateRangeQuery);
  };

  const updateWage = async (wage: WageObjectProps) => {
    if (user === null)
      return { success: false, msg: "You are not authenticated." };

    const wageIndex = wages.findIndex((w) => w.docId === wage.docId);
    if (wageIndex === -1)
      return { success: false, msg: "The provided document id was not found." };

    const oldWage = wages[wageIndex];

    setWages((prevWages) => {
      const newWages = [...prevWages];
      newWages[wageIndex] = wage;
      return sortWages(newWages);
    });

    try {
      const updatedWage = await UpdateWage(user, wage);
      if (!updatedWage.success) {
        setWages((prevWages) => {
          const newWages = [...prevWages];
          newWages[wageIndex] = oldWage;
          return sortWages(newWages);
        });

        return { success: false, msg: updatedWage.error || "Update failed." };
      }

      return { success: true, msg: "Update successful!" };
    } catch (err) {
      // If there's an error, revert the wage.
      setWages((prevWages) => {
        const newWages = [...prevWages];
        newWages[wageIndex] = oldWage;
        return sortWages(newWages);
      });

      return { success: false, msg: "Operation to update data failed." };
    }
  };

  const value = {
    wages,
    isLoadingWages,
    refreshWages: getWages,
    addWage,
    deleteWage,
    setDateRange,
    undoDelete,
    updateWage,
  };

  return (
    <WagesContext.Provider value={value}>{children}</WagesContext.Provider>
  );
};
