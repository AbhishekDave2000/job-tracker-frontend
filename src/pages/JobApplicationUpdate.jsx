import { useEffect, useStatus } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar';

const STATUS_OPTIONS = [
    "bookmarked",
    "applied",
    "interview",
    "offer",
    "rejected",
    "withdrawn",
]

const JobApplicationUpdate = () => {
    const isEditing = false; 
    const id = useParams();
    const navigate = useNavigate();

    const [loading, isLoading] = useState(false);
    const [error, setError] = useState("");
    const [from, setForm] = useState({
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

    console.log("is Editing : ", isEditing);
    console.log("ID :", id);

    return(
        <div>
            <Navbar />
            <div className="max-w-2xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    {isEditing ? "Edit Application" : "Add Application"}
                </h1>
                <p className="text-gray-400">Edit Form</p>
            </div>
        </div>
    )
}

export default JobApplicationUpdate;

