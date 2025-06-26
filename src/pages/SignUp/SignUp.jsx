import './SignUp.css';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
const baseURL = import.meta.env.VITE_BACKEND_URL;


export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleGoogleLogin = () => {
        window.location.href = `${baseURL}/api/auth/google`; 
    };

    const handleSignUp = async () => {
        if (!email || !password || !name) {
            notifications.show({
            title: 'Error!',
            message: 'Please fill in all fields.',
            color: 'red',
            });
            return;
        }

        try {
            const response = await fetch(`${baseURL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    displayName: name,
                    email: email,
                    password: password,
                }),
            });

            if (response.ok) {
                localStorage.setItem('email', email);
                window.location.href = '/verify-otp';
            } 
            else {
                const { error } = await response.json();
                notifications.show({
                    title: 'Error!',
                    message: error || 'Sign-up failed.',
                    color: 'red',
                });
            }
        } catch (err) {
            notifications.show({
            title: 'Error!',
            message: 'Something went wrong.',
            color: 'red',
            });
        }
    };

    
    return (
        <div className="home-container">
            <div className="signup-card">
                <h2 className="hero-h1">Sign Up</h2>
                <div className="signup-bar">
                    <input className="signup-input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="signup-bar">
                    <input className="signup-input" type='email' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="signup-bar">
                    <input className="signup-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button className="signup-button" onClick={handleSignUp}>
                    Continue
                </button>

                <div className="divider"></div>

                <button className="signup-button" onClick={handleGoogleLogin}>
                    <i className="fa-brands fa-google"></i>&nbsp;Sign in with Google
                </button>
            </div>
        </div>
    );
}