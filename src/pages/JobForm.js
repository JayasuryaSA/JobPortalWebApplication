import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "http://localhost:8080";

const JobForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const existingJob = location.state?.job || {};

    const auth = JSON.parse(sessionStorage.getItem("auth"));
    const userRole = auth?.role === "ROLE_ADMIN" ? "ROLE_ADMIN" : "ROLE_USER"; // Ensure correct role check

    useEffect(() => {
        if (userRole !== "ROLE_ADMIN") {
            alert("Access Denied! Only admins can add or edit jobs.");
            navigate("/");
        }
    }, [userRole, navigate]);

    const [job, setJob] = useState({
        postId: existingJob.postId || "",
        postName: existingJob.postName || "",
        postDesc: existingJob.postDesc || "",
        reqExperience: existingJob.reqExperience || "",
        techStack: existingJob.techStack ? existingJob.techStack.join(", ") : "",
    });

    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (existingJob.postId) {
                await axios.put(`${API_URL}/jobPost`, { ...job, techStack: job.techStack.split(", ") }, { auth });
                alert("Job updated successfully!");
            } else {
                await axios.post(`${API_URL}/jobPost`, { ...job, techStack: job.techStack.split(", ") }, { auth });
                alert("Job added successfully!");
            }
            navigate("/");
        } catch (error) {
            console.error("Error saving job:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-yellow-400 text-center">
                    {existingJob.postId ? "Edit Job" : "Add Job"}
                </h2>
                <form onSubmit={handleSubmit} className="mt-4">
                    
                    {/* Post ID Field (Disabled for Editing) */}
                    <label className="block mb-2 text-gray-400">Job ID</label>
                    <input
                        type="text"
                        name="postId"
                        value={job.postId}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-yellow-400"
                        disabled={!!existingJob.postId} // Disable if editing
                        required
                    />

                    <label className="block mt-4 mb-2 text-gray-400">Job Name</label>
                    <input
                        type="text"
                        name="postName"
                        value={job.postName}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-yellow-400"
                        required
                    />

                    <label className="block mt-4 mb-2 text-gray-400">Description</label>
                    <textarea
                        name="postDesc"
                        value={job.postDesc}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-yellow-400"
                        required
                    />

                    <label className="block mt-4 mb-2 text-gray-400">Required Experience (in years)</label>
                    <input
                        type="number"
                        name="reqExperience"
                        value={job.reqExperience}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-yellow-400"
                        required
                    />

                    <label className="block mt-4 mb-2 text-gray-400">Tech Stack (comma separated)</label>
                    <input
                        type="text"
                        name="techStack"
                        value={job.techStack}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-yellow-400"
                        required
                    />

                    <div className="mt-6 flex justify-between">
                        <button type="button" onClick={() => navigate("/")} className="bg-gray-600 text-white p-2 rounded w-1/3">
                            Cancel
                        </button>
                        <button type="submit" className="bg-yellow-400 text-black p-2 rounded w-1/3">
                            {existingJob.postId ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobForm;
