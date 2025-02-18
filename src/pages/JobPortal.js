import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = "http://localhost:8080";

const JobPortal = () => {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const auth = JSON.parse(sessionStorage.getItem("auth")) || null;
    const isAdmin = auth?.role === "ROLE_ADMIN";

    useEffect(() => { if (auth) loadJobs(); else navigate("/login"); }, []);

    const loadJobs = async () => {
        try { setJobs((await axios.get(`${API_URL}/jobPosts`, { auth })).data); }
        catch (error) { console.error("Error fetching jobs:", error); }
    };

    const handleDelete = async (jobId) => {
        if (isAdmin && window.confirm("Are you sure?")) {
            try { await axios.delete(`${API_URL}/jobPost/${jobId}`, { auth }); loadJobs(); }
            catch (error) { console.error("Error deleting job:", error); }
        }
    };

    const Button = ({ text, onClick, className }) => (
        <motion.button onClick={onClick} className={`p-2 rounded ${className}`}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{text}</motion.button>
    );

    const filteredJobs = jobs.filter(j => [j.postId, j.postName, j.postDesc, ...(j.techStack || [])]
        .some(field => field.toString().toLowerCase().includes(search.toLowerCase())));

    return (
        <motion.div className="min-h-screen bg-gray-900 text-white p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-yellow-400">Find your dream job</h2>
                <div className="flex gap-4 mt-4">
                    <motion.input type="text" placeholder="Search..." value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-2 rounded bg-gray-800 border-gray-700 w-full" 
                        whileFocus={{ scale: 1.02 }} />
                    {isAdmin && <Button text="Post Job" onClick={() => navigate("/addjob")} className="bg-yellow-400 text-black" />}
                    <Button text="Logout" onClick={() => { sessionStorage.removeItem("auth"); navigate("/login"); }} className="bg-red-500 text-white" />
                </div>
                <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                    {filteredJobs.length === 0 ? (
                        <p className="text-gray-400 text-center">No jobs found.</p>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-yellow-400 border-b border-gray-700">
                                    {['Job ID', 'Job Name', 'Description', 'Experience', 'Tech Stack', isAdmin && 'Actions'].map(h => h && <th key={h} className="p-2">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJobs.map(job => (
                                    <motion.tr key={job.postId} className="border-b border-gray-700" whileHover={{ scale: 1.01 }}>
                                        {[job.postId, job.postName, job.postDesc, job.reqExperience, job.techStack?.join(", ") || "N/A"].map((d, i) => <td key={i} className="p-2">{d}</td>)}
                                        {isAdmin && (
                                            <td className="p-2 flex gap-2">
                                                <Button text="Edit" onClick={() => navigate("/addjob", { state: { job } })} className="bg-blue-500" />
                                                <Button text="Delete" onClick={() => handleDelete(job.postId)} className="bg-red-500" />
                                            </td>
                                        )}
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default JobPortal;
