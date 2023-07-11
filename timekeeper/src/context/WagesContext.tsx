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
import { useAuthContext } from "./AuthContext";

interface WagesContextType {
  wages: WageObjectProps[];
  isLoadingWages: boolean;
  refreshWages: () => Promise<void>;
  addWage: (wage: CreateWageProps) => Promise<void>;
  deleteWage: (docId: string) => Promise<void>;
}

const WagesContext = createContext<WagesContextType | undefined>(undefined);

export const useWages = (): WagesContextType => {
  const context = useContext(WagesContext);
  if (!context) {
    throw new Error("useWages must be used within a WagesProvider");
  }
  return context;
};

export const WagesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const [isLoadingWages, setIsLoadingWages] = useState<boolean>(false);
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

  const addWage = async (wage: CreateWageProps) => {
    try {
      const newWage = await CreateWage(user, wage);
      if (newWage) {
        setWages((prevWages) => [...prevWages, newWage]);
      } else {
        throw new Error(
          "Wage was not successfully added to the database. Cancelling local state update..."
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteWage = async (docId: string) => {
    if (user) {
      try {
        await DeleteWage(user, docId);
        setWages((prevWages) =>
          prevWages.filter((wage) => wage.docId !== docId)
        );
      } catch (err) {
        console.log(err);
      }
    }
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
  };

  return (
    <WagesContext.Provider value={value}>{children}</WagesContext.Provider>
  );
};
