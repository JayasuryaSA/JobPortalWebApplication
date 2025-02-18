import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import JobPortal from "./pages/JobPortal";
import JobForm from "./pages/JobForm";
import Login from "./pages/Login";
import Register from "./pages/Register";

const PrivateRoute = ({ children }) => {
    const authData = sessionStorage.getItem("auth");
    const auth = authData ? JSON.parse(authData) : null;

    return auth ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const authData = sessionStorage.getItem("auth");
    const auth = authData ? JSON.parse(authData) : null;

    // Check if the user is an admin (ROLE_ADMIN is stored in DB)
    const isAdmin = auth?.role === "ROLE_ADMIN";

    return isAdmin ? children : <Navigate to="/jobportal" />;
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/jobportal" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/jobportal"
                    element={
                        <PrivateRoute>
                            <JobPortal />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/addjob"
                    element={
                        <AdminRoute>
                            <JobForm />
                        </AdminRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
