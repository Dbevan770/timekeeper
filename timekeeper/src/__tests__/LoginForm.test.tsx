import { render } from "@testing-library/react";
import { db, auth } from "../../setupTests";
import { LoginForm } from "../components/LoginForm/LoginForm";

jest.mock("../firebaseConfig", () => require("../../__mocks__/firebaseConfig"));
jest.mock("firebase/app", () => ({
  getFirestore: () => db,
  getAuth: () => auth,
}));
jest.mock("../auth/signin");

describe("<LoginForm />", () => {
  test("should display a blank login from, with password visibility off by default", async () => {
    const setMessage = jest.fn();
    const setSeverity = jest.fn();
    const setOpenSnackbar = jest.fn();

    const { getByTestId } = render(
      <LoginForm
        setMessage={setMessage}
        setSeverity={setSeverity}
        setOpenSnackbar={setOpenSnackbar}
      />
    );

    const form = getByTestId("login-form");
    expect(form).toBeInTheDocument();
  }, 25000);
});
