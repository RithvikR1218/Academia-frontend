import { Button } from '@mantine/core';
const baseURL = import.meta.env.VITE_BACKEND_URL;


export default function Login() {
    const handleLogin = () => {
        window.location.href = `${baseURL}/api/auth/google`; // adjust port if needed
      };
    
      return (
        <Button onClick={handleLogin}>
          Login with Google
        </Button>
      );
}