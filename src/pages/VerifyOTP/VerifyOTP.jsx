import './VerifyOTP.css';
import { useRef, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
const baseURL = import.meta.env.VITE_BACKEND_URL;


export default function VerifyOTP() {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (!storedEmail) {
        navigate('/signup')
    }
  }, [navigate]);

  const focusAndPlaceCursorEnd = (input) => {
    input.focus();
    const length = input.value.length;
    input.setSelectionRange(length, length);
};

    const handleChange = (e, index) => {
        const value = e.target.value;

        if (/^\d$/.test(value)) {
            e.target.value = value;
            if (index < 5) {
                const nextInput = inputRefs.current[index + 1];
                if (nextInput) focusAndPlaceCursorEnd(nextInput);
            }
        }
        else {
            e.target.value = '';
            const currentInput = inputRefs.current[index];
            if (currentInput) focusAndPlaceCursorEnd(currentInput);
        }
    }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) focusAndPlaceCursorEnd(prevInput);
    }
    if (e.key === 'Enter') {
        handleVerify();
    }
    if (e.key === 'ArrowRight' && index < 5) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) focusAndPlaceCursorEnd(nextInput);
    }
    if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) focusAndPlaceCursorEnd(prevInput);
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
            navigate('/login')
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
        <div className="gradient-blob-top"></div>
        <div className="gradient-blob-bottom"></div>
        <div className="gradient-blob-footer"></div>
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