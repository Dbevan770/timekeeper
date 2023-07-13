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
    let result: WageObjectProps[] = [];

    if (user) {
      result = await GetFilteredWages(user, dateRangeQuery);

      // Sort the result array by shiftDate in descending order
      result.sort((a, b) => b.shiftDate.toMillis() - a.shiftDate.toMillis());
    }

    setWages(result);
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
      if (!newWage) {
        throw new Error(
          "Wage was not successfully added to the database. Rolling back local state update..."
        );
      } else {
        setWages((prevWages) =>
          sortWages(
            prevWages.map((prevWage) =>
              prevWage.docId === tempId ? newWage : prevWage
            )
          )
        );
        return { success: true, msg: "Save successful" };
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
      if (response.success) {
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

  const value = {
    wages,
    isLoadingWages,
    refreshWages: getWages,
    addWage,
    deleteWage,
    setDateRange,
    undoDelete,
  };

  return (
    <WagesContext.Provider value={value}>{children}</WagesContext.Provider>
  );
};
