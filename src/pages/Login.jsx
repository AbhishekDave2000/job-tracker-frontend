import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth.api'
import useAuthStore from '../store/useAuthStore';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleLogin = async () => {
        console.log("Sending to API", email, password);

        try {
            const response = await login({email, password});

            setAuth(response.data.token, response.data.user);

            navigate('/application');
            console.log("API response : " + response.data);
        } catch (err) {
            alert("Login Failed.");
        }
    }

    return (
        <div className="flex flex-col space-y-2">
            <h1>Login</h1>
            
            <input 
                type="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                type="password"
                value={password} 
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} className="bg-blue-600 size-fit mx-6 px-6 py-1 border-0 rounded-sm text-white">Login</button>
        </div>
    )
}

export default Login;