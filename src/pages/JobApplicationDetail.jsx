import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { getJobApplication } from '../api/jobApplications.api';

const JobApplicationDetail = () => {
    const id = useParams().id;
    const navigate = useNavigate();
    
    const [application, setApplication] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect( ()=> {
        const fetchApplication = async () => {
            try {
                const response = await getJobApplication(id);
                // console.log(response.data.application || []);
                setApplication(response.data.application || []);
            } catch(err) {
                setError("Application not found")
            } finally{
                setLoading(false);
            }
        }

        fetchApplication()
    }, [id]);

    if (loading) return <div><Navbar /><p className="p-8 text-gray-400">Loading...</p></div>
    if (error)   return <div><Navbar /><p className="p-8 text-red-500">{error}</p></div>
    if (!application) return null

    return(
        <div>
            <Navbar />
                <div>
                    <h1>Job Application Detail</h1>
                    <div><h3>{application.company_name}</h3></div>
                    <div>{application.job_title}</div>
                </div>
        </div>
    )
}

export default JobApplicationDetail;