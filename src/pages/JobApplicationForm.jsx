import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getJobApplication, createJobApplication, updateJobApplication } from '../api/jobApplications.api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
    "bookmarked",
    "applied",
    "interview",
    "offer",
    "rejected",
    "withdrawn",
]

const JobApplicationForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id); 

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fetching, setFetching] = useState(isEditing);

    const [form, setForm] = useState({
        company_name:    "",
        job_title:       "",
        job_url:         "",
        location:        "",
        remote:          false,
        status:          "bookmarked",
        applied_date:    "",
        salary_min:      "",
        salary_max:      "",
        job_description: "",
        notes:           "",
    })

    useEffect(() => {
        if (!isEditing) return

        const fetchApplication = async () => {
            try {
                const response = await getJobApplication(id);
                const app = response.data.application || [];

                // console.log("Existing Application : ", app);

                // Populate Form with the existing values in the application
                setForm({
                    company_name:    app.company_name       || "",
                    job_title:       app.job_title          || "",
                    job_url:         app.job_url            || "",
                    location:        app.location           || "",
                    remote:          app.remote             || false,
                    status:          app.status             || "bookmarked",
                    applied_date:    app. applied_date      || "",
                    salary_min:      app.salary_min         || "",
                    salary_max:      app.salary_max         || "",
                    job_description: app.job_description    || "",
                    notes:           app.notes              || "",
                })
            } catch(err) {
                setError("Failed to load application");
            } finally {
                setFetching(false);
            }
        } 

        fetchApplication()
    }, [id, isEditing])

    if(fetching) {
        return(
            <div>
                <Navbar />
                <p className='max-w-2xl mx-auto mt-8 p-8 text-center text-gray-600 border border-green-400 rounded-lg '>Loading ...</p>
            </div>
        )
    }
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleSubmit = async () => {
        if (!form.company_name || !form.job_title) {
            setError("Company name and the Job Title are required.")
            return
        }

        try {
            setLoading(true)
            setError("")

            if(isEditing){
                await updateJobApplication(id, form);
                toast.success("Application Saved Successfully.")
            } else {
                await createJobApplication(form);
                toast.success("Application Created Successfully.");
            }

            navigate("/applications");
        } catch(err) {
            setError(err.response?.data?.message || "Failed to save the application." )
        } finally {
            setLoading(false);
        }
    }

    return(
        <div>
            <Navbar />
            <div className="max-w-2xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate("/applications")}
                        className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isEditing ? "Edit Application" : "Add Application"}
                    </h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Company Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="company_name"
                            value={form.company_name}
                            onChange={handleChange}
                            placeholder="eg. Google"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Job Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="job_title"
                            value={form.job_title}
                            onChange={handleChange}
                            placeholder="eg. Software Engineer"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Job URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job URL
                        </label>
                        <input
                            type="url"
                            name="job_url"
                            value={form.job_url}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Location + Remote */}
                    <div className="flex gap-3 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="eg. Toronto, ON"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-2 pb-2">
                            <input
                                type="checkbox"
                                name="remote"
                                id="remote"
                                checked={form.remote}
                                onChange={handleChange}
                                className="w-4 h-4 accent-indigo-600"
                            />
                            <label htmlFor="remote" className="text-sm text-gray-700">
                                Remote
                            </label>
                        </div>
                    </div>

                    {/* Salary Range */}
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Salary Min ($)
                            </label>
                            <input
                                type="number"
                                name="salary_min"
                                value={form.salary_min}
                                onChange={handleChange}
                                placeholder="eg. 80000"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            </div>
                            <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Salary Max ($)
                            </label>
                            <input
                                type="number"
                                name="salary_max"
                                value={form.salary_max}
                                onChange={handleChange}
                                placeholder="eg. 120000"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Applied Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Applied Date
                        </label>
                        <input
                            type="date"
                            name="applied_date"
                            value={form.applied_date}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Job Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job Description
                        </label>
                        <textarea
                            name="job_description"
                            value={form.job_description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Paste the job description here..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                        </label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Any personal notes..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => navigate("/applications")}
                            className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
                        >
                            {loading
                                ? isEditing ? "Updating..." : "Saving..."
                                : isEditing ? "Update Application" : "Save Application"
                            }
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default JobApplicationForm;

