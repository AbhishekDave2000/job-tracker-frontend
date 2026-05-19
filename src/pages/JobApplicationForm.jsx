import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const JobApplicationForm = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <div className="max-w-2xl mx-auto px-6 py-8">

                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Add Application
                </h1>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <p className="text-gray-400">Form coming next step</p>
                </div>

            </div>
        </div>
    )
}

export default JobApplicationForm;