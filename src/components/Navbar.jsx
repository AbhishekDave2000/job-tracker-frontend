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
        <nav>
            <div>
                <Link to="/applications">
                    JobTracker
                </Link>

                <div>
                    <span>
                        {user?.first_name} {user?.last_name}
                    </span>
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}


export default Navbar;