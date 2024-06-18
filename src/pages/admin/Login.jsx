import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Recaptcha from 'react-recaptcha';

const API_ENDPOINT = '/api/auth/login';
const RECAPTCHA_SITE_KEY = '6LekYvspAAAAAC6_dN04Zw1Vksy_sNt56DIVhcWK'; // Replace with your own site key

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);

  useEffect(() => {
    // Check session here and redirect if already logged in
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/check-session'); // Endpoint to check session status

        if (response.ok) {
          router.push('/admin/Dashboard'); // Redirect to Dashboard if session is active
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter a username and password');
      return;
    }

    if (!isRecaptchaVerified) {
      setError('Please complete the reCAPTCHA');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        router.push('/admin/Dashboard'); // Redirect to Dashboard after successful login
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRecaptchaVerify = (response) => {
    if (response) {
      setIsRecaptchaVerified(true);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-stone-900 to-red-900">
      <div className="p-6 bg-gray-100 rounded-md shadow-md m-4">
        <h1 className="text-3xl font-semibold mb-3 text-red-800">MGA Corretora Admin</h1>
        <label className='text-lb font-semibold ml-2'>Usuário</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <label className='text-lb font-semibold ml-2'>Senha</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && handleLogin()}
          className="w-full px-4 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        {typeof window !== 'undefined' && (
          <Recaptcha
            sitekey={RECAPTCHA_SITE_KEY}
            render="explicit"
            verifyCallback={onRecaptchaVerify}
          />
        )}
        <button
          onClick={handleLogin}
          disabled={isLoading || !isRecaptchaVerified}
          className="w-full mt-5 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
