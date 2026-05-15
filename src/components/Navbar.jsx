import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return(
        <nav className='bg-white border-b border-gray-200 px-6 py-4'>
            <div className='max-w-6xl mx-auto flex items-center justify-between'>
                <Link to="/applications" className='text-xl font-bold text-indigo-600'>
                    JobTracker
                </Link>

                <div className='flex items-center gap-4'>
                    <span className='text-sm text-gray-600'>
                        {user?.first_name} {user?.last_name}
                    </span>
                    <button onClick={handleLogout} className='text-sm text-red-500 hover:text-red-700 font-medium'>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}


export default Navbar;