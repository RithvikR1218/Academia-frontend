import './VerifyOTP.css';
import { useRef, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
const baseURL = import.meta.env.VITE_BACKEND_URL;


export default function VerifyOTP() {
  const inputRefs = useRef([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (!storedEmail) {
        window.location.href = '/signup';
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^\d$/.test(value)) {
        e.target.value = value;
        if (index < 5) {
            inputRefs.current[index + 1].focus();
        }
    } 
    else {
        e.target.value = '';
        inputRefs.current[index].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otp = inputRefs.current.map(input => input.value).join('');
    console.log('OTP entered:', otp); 

    if (otp.length !== 6) {
        alert('Please enter a valid 6-digit OTP');
        return;
    }

    try {
        const response = await fetch(`${baseURL}/api/auth/verifyOTP`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                otp,
                email: localStorage.getItem('email'),
            }),
        });     

        if(response.ok){
            localStorage.removeItem('email');
            window.location.href = '/login';
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
        <div className="login-card">
            <h2 className="hero-h1">Enter OTP</h2>
            <p className="otp-instructions">Verify the 6-digit code to your email</p>

            <div className="otp-input-group">
            {[...Array(6)].map((_, i) => (
                <input
                key={i}
                type="text"
                maxLength={1}
                className="otp-input"
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                ref={(el) => (inputRefs.current[i] = el)}
                />
            ))}
            </div>
            <button className="login-button" onClick={handleVerify}>
                Verify
            </button>
        </div>
    </div>
  );
}