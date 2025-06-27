import './Login.css';
import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
const baseURL = import.meta.env.VITE_BACKEND_URL;


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLocalLogin();
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard')
        }
    }, [navigate]);

    const handleGoogleLogin = () => {
        window.location.href = `${baseURL}/api/auth/google`; 
    };

    const handleLocalLogin = async () => {
        if (!email || !password) {
            notifications.show({
            title: 'Error!',
            message: 'Enter Email and Password.',
            color: 'red',
            });
            return;
        }

        try {
            const response = await fetch(`${baseURL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (response.ok) {
                const { _, token } = await response.json();
                localStorage.setItem('token', token);
                navigate('/dashboard')
            } 
            else {
                const { error } = await response.json();
                notifications.show({
                    title: 'Error!',
                    message: error || 'Login failed.',
                    color: 'red',
                });
            }
        } 
        catch (err) {
            notifications.show({
            title: 'Error!',
            message: 'Something went wrong.',
            color: 'red',
            });
        }
    };
    
    return (
        <div className="login-container">
            <div className="gradient-blob-top"></div>
            <div className="gradient-blob-bottom"></div>
            <div className="gradient-blob-footer"></div>
            <div className='login-card'>
                <h2 className="hero-h1">Login</h2>
                <div className="login-bar">
                    <input className="login-input" type='email' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown}/>
                </div>
                <div className="login-bar">
                    <input className="login-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown}/>
                </div>

                <button className="login-button" onClick={handleLocalLogin}>
                    Login
                </button>


                <div className="signup-prompt">
                    <h3>Don't have an account?</h3>
                    <a href="/signup" className="signup-link">Sign Up</a>
                </div>


                <div className="divider"></div>

                <button className="login-button" onClick={handleGoogleLogin}>
                    <i className="fa-brands fa-google"></i>&nbsp;Sign in with Google
                </button>
            </div>
        </div>
    );
}