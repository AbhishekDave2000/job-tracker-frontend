import { useState, useEffect }  from 'react';
import { useNavigate }          from 'react-router-dom';
import Navbar                   from '../components/Navbar';
import StatusBadge              from '../components/StatusBadge';
import { getJobApplications, 
        deleteJobApplication, 
        getJobApplicationsByStatus }   from '../api/jobApplications.api';
import toast from 'react-hot-toast';

const JobApplications = () => {
    const navigate = useNavigate();

    const [applications, setApplications]   = useState([]);
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState("");
    const [filter, setFilter]               = useState("");

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                let response;
                if ( filter.length === 0 ) {
                    console.log("Hello From If")
                    response = await getJobApplications();
                } else {
                    console.log("Hello From Else")
                    response = await getJobApplicationsByStatus(filter);
                }
                // console.log("Applications: " + response.data.applications);
                const apps = response?.data?.applications || [];
                setApplications(apps);
            } catch (err) {
                setError("Failed To Load Applications.");
            } finally {
                setLoading(false);
            }
        }

        fetchApplications();
    }, [filter]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this application") ) return

        try {
            await deleteJobApplication(id);
            toast.success("Application deleted");

            setApplications((prev) => prev.filter((app) => app.id != id));
        } catch(err) {
            toast.error("Failed To Delete");
        }
    }

    if(loading) {
        return (
            <div>
                <Navbar />
                <div className="max-w-5xl mx-auto px-6 py-8">
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        )
    }


    if(error) {
        return(
            <div>
                <Navbar />
                <div className='max-w-5xl mx-auto px-6 py-8'>
                    <p className='text-red-500'>{error}</p>
                </div>
            </div>
        )
    }

    return(
        <div>
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-8">

                <div className="flex item-center justify-between mb-6">
                    <h1 className='text-2xl font-bold text-gray-800'>
                        Job Applications
                    </h1>
                    <button 
                        onClick={() => navigate('/applications/new')}
                        className='bg-indigo-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition'>
                        + Add Application
                    </button>
                </div>

                <div className='max-w-5xl flex items-center justify-end mb-6'>
                    <select name="filter" id="filter" onChange={(e) => setFilter(e.target.value)} value={filter} className='font-semibold text-gray-400 outline-none mx-4'>
                        <option value="">           No Selection</option>
                        <option value="bookmarked"> Bookmarked</option>
                        <option value="applied">    Applied</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="offer">      Offer</option>
                        <option value="rejected">   Rejected</option>
                        <option value="withdrawn">  Withdrawn</option>
                    </select>
                    <button
                        className='bg-indigo-800 text-white text-sm px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-700 transition'
                    >
                        Filter
                    </button>
                </div>


                { applications.length === 0 ? (
                    <div className='text-center py-20'>
                        <div className='text-lg text-gray-400'>No Applications With Specific Status Yet</div>
                        <p className='text-gray-300 text-sm mt-1'>
                            Click "+ Add Application"
                        </p>
                    </div>
                ) : ( 
                    <div className="space-y-3">
                        {applications.map((app) => (
                            <div 
                                key={app.id}
                                className='bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center justify-between hover:shadow-sm transition'
                            >
                                {/* Left Side */}
                                <div 
                                    className='flex-1 cursor-pointer'
                                    onClick={() => navigate(`/applications/${app.id}`)}
                                >
                                    <h2 className='font-semibold text-gray-800'>{app.company_name}</h2>
                                    <p className='text-sm text-gray-500 mt-0.5'>{app.job_title}</p>
                                    <p className='text-xs text-gray-400 mt-1'>
                                        {app.location} {app.remote ? ". Remote" : ""}
                                    </p>
                                </div>
                                
                                {/* Right Side */}
                                <div className='flex flex-col items-end gap-2'>
                                    <StatusBadge status={app.status} />
                                    <p className='text-xs text-gray-400'>
                                        {app.applied_date || "No Date"}
                                    </p>

                                    <button 
                                        className='text-xs text-red-400 hover:text-red-600 transition'
                                        onClick={() => handleDelete(app.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default JobApplications;