import './Login.css';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
const baseURL = import.meta.env.VITE_BACKEND_URL;


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                window.location.href = '/dashboard';
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
        <div className="home-container">
            <div className='login-card'>
                <h2 className="hero-h1">Login</h2>
                <div className="login-bar">
                    <input className="login-input" type='email' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="login-bar">
                    <input className="login-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <button className="login-button" onClick={handleLocalLogin}>
                    Login
                </button>

                <div className="divider"></div>

                <button className="login-button" onClick={handleGoogleLogin}>
                    <i className="fa-brands fa-google"></i>&nbsp;Sign in with Google
                </button>
            </div>
        </div>
    );
}