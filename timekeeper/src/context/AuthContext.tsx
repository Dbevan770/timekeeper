import { FIREBASE_AUTH } from "../firebaseConfig";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: FirebaseUser | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: any }) => {
  const auth = FIREBASE_AUTH;
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
