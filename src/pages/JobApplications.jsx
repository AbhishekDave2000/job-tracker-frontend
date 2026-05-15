import Navbar from '../components/Navbar';

const JobApplications = () => {
    return(
        <div>
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-8">

                <div className="flex item-center justify-between mb-6">
                    <h1 className='text-2xl font-bold text-gray-800'>
                        Job Applications
                    </h1>
                    <button className='bg-indigo-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition'>
                        + Add Application
                    </button>
                </div>

                <p className='text-gray-400'>Applications will show up here.</p>
            </div>
        </div>
    )
}

export default JobApplications;