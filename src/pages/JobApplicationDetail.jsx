import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ContactsTab from '../components/ContactsTab';

import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { deleteJobApplication, getJobApplication } from '../api/jobApplications.api';
import toast from 'react-hot-toast';

const JobApplicationDetail = () => {
    const id = useParams().id;
    const navigate = useNavigate();
    
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("contacts");

    useEffect( ()=> {
        const fetchApplication = async () => {
            try {
                const response = await getJobApplication(id);
                setApplication(response.data.application || []);
            } catch(err) {
                setError("Application not found")
            } finally{
                setLoading(false);
            }
        }

        fetchApplication()
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Delete this application?")) return

        try {
            await deleteJobApplication(id);
            toast.success("Job Application Successfully Deleted.")
            navigate("/applications");
        } catch (err) {
            toast.error("Failed to delete.")
        }
    }

    if (loading) return <div><Navbar /><p className="p-8 text-gray-400">Loading...</p></div>
    if (error)   return <div><Navbar /><p className="p-8 text-red-500">{error}</p></div>
    if (!application) return null

    return(
        <div>
            <Navbar />
            <div className='max-w-3xl mx-auto px-6 py-8'>

                {/* Header */}
                <div>
                    <button
                        onClick={() => navigate("/applications")}
                        className='text-gray-400 hover:text-gray-600 text-sm'
                    >
                        ← Back
                    </button>
                </div>

                {/* Application Card */}
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                    
                    {/* Header Section */}
                    <div className='flex items-start justify-between mb-6'>
                        <div>
                            <h1 className='text-2xl font-bold text-gray-800'>
                                {application.company_name}
                            </h1>
                            <p className='text-gray-500 mt-1'>
                                {application.job_title}
                            </p>
                            <p className='text-sm text-gray-400 mt-1'>
                                {application.location}
                                {application.remote ? " . Remote" : ""}
                            </p>
                        </div>
                        <div className='flex flex-col items-end gap-3'>
                            <StatusBadge status={application.status} />

                            <div className='flex gap-2'>
                                <button 
                                    onClick={() => navigate(`/applications/${id}/edit`)}
                                    className='text-sm border border-gray-300 text-gray-600 px-3 py-1  rounded-lg hover:bg-gray-50 transition'
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className='text-sm text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition'
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        
                    </div>

                    <div className='grid grid-cols-2 gap-4 py-4 border-t border-gray-100'>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Applied Date</p>
                            <p className="text-sm text-gray-700">
                                {application.applied_date || "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Salary Range</p>
                            <p className="text-sm text-gray-700">
                                {application.salary_min && application.salary_max
                                ? `$${application.salary_min} - $${application.salary_max}`
                                : "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Job URL</p>
                            {application.job_url ? (
                                <a
                                    href={application.job_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-indigo-600 hover:underline"
                                >
                                    View Job Posting
                                </a>
                            ) : (
                                <p className="text-sm text-gray-700">—</p>
                            )}
                        </div>
                    </div>
                    {/* Notes */}
                    {application.notes && (
                        <div className="py-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400 mb-2">Notes</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line">
                                {application.notes}
                            </p>
                        </div>
                    )}

                    {/* Job Description */}
                    {application.job_description && (
                        <div className="py-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400 mb-2">Job Description</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line">
                                {application.job_description}
                            </p>
                        </div>
                    )}

                </div>
            </div>

            <div className='flex gap-2 mb-4 items-center justify-center'>
                <button
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "contacts" ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    onClick={() => setActiveTab("contacts")}
                >
                    Contact
                </button>

                <button
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "followups" ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"} `}
                    onClick={() => setActiveTab("followups")}
                >
                    Follow Ups
                </button>
            </div>

            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                {activeTab === "contacts" && <ContactsTab jobApplicationId={id} />}
                {activeTab === "followups" && <p className="text-gray-400">This is the Follow Ups Tab</p>}
            </div>
        </div>
    )
}

export default JobApplicationDetail;