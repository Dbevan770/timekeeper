import { initializeApp } from "firebase/app";
import {
  getFirestore,
  connectFirestoreEmulator,
  terminate,
} from "firebase/firestore";
import { getAuth, connectAuthEmulator, signOut } from "firebase/auth";
import firebaseConfig from "./__mocks__/firebaseConfig";

const app = initializeApp(firebaseConfig);

export let db: ReturnType<typeof getFirestore> | null = null;
export let auth: ReturnType<typeof getAuth> | null = null;

beforeEach(() => {
  auth = getAuth(app);
  db = getFirestore(app);
});

if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  db && connectFirestoreEmulator(db, "localhost", 8080);
  auth && connectAuthEmulator(auth, "https://localhost:9099/");
}

afterEach(async () => {
  auth && (await signOut(auth));
  db && (await terminate(db));
});
