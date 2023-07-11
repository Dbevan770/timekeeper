import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ErrorPage from "./scenes/ErrorPage/ErrorPage.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { WagesProvider } from "./context/WagesContext.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Register from "./scenes/Register/Register.tsx";
import Account from "./scenes/Account/Account.tsx";
import Login from "./scenes/Login/Login.tsx";
import Dashboard from "./scenes/Dashboard/Dashboard.tsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";
import AddShift from "./scenes/Dashboard/AddWages/AddShift.tsx";
import Success from "./scenes/Dashboard/AddWages/Success/Success.tsx";
import SettingsPage from "./scenes/SettingsPage/SettingsPage.tsx";
import Shifts from "./scenes/Shifts/Shifts.tsx";
import CustomMuiThemeProvider from "./components/CustomMuiThemeProvider/CustomMuiThemeProvider.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <WagesProvider>
        <ThemeProvider>
          <CustomMuiThemeProvider>
            <Router>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/add-wages" element={<AddShift />} />
                  <Route
                    path="/dashboard/add-wages/success"
                    element={<Success />}
                  />
                  <Route path="/shifts" element={<Shifts />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Router>
          </CustomMuiThemeProvider>
        </ThemeProvider>
      </WagesProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
