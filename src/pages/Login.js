import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

const Login = () => {
    const [user, setUser] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/login`, user);
            
            // Store auth details including role
            sessionStorage.setItem(
                "auth",
                JSON.stringify({
                    username: response.data.username,
                    password: user.password, // Keeping password for Basic Auth
                    role: response.data.role, // Store role from backend
                })
            );

            alert("Login Successful!");
            navigate("/jobportal");
        } catch (error) {
            alert("Invalid credentials!");
            console.error("Login error:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-yellow-400 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="mt-4">
                    <label className="block text-gray-400">Username</label>
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        value={user.username} 
                        onChange={handleChange} 
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-yellow-400"
                        required
                    />

                    <label className="block mt-4 text-gray-400">Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        value={user.password} 
                        onChange={handleChange} 
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-yellow-400"
                        required
                    />

                    <button type="submit" className="mt-6 w-full bg-yellow-400 text-black p-2 rounded">
                        Login
                    </button>

                    <p className="text-gray-400 mt-4 text-center">
                        Don't have an account? 
                        <a href="/register" className="text-yellow-400 ml-1">Register</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
