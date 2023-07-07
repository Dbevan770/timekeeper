import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
  ReactNode,
} from "react";
import {
  GetWages,
  WageObjectProps,
  CreateWageProps,
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
  const [wages, setWages] = useState<WageObjectProps[]>([]);

  const getWages = useCallback(async () => {
    setIsLoadingWages(true);
    let result: WageObjectProps[] = [];

    if (user) {
      result = await GetWages(user);

      const now = Date.now();
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

      result = result.filter((wage) => wage.shiftDate.toMillis() >= oneWeekAgo);

      // Sort the result array by shiftDate in descending order
      result.sort((a, b) => b.shiftDate.toMillis() - a.shiftDate.toMillis());
    }

    setWages(result);
    setIsLoadingWages(false);
  }, [user]);

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

  const value = {
    wages,
    isLoadingWages,
    refreshWages: getWages,
    addWage,
    deleteWage,
  };

  return (
    <WagesContext.Provider value={value}>{children}</WagesContext.Provider>
  );
};
