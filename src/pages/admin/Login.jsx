import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const API_ENDPOINT = '/api/auth/login';

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter a username, password');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password}),
      });

      if (response.ok) {
        router.push('/admin/Dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/auth/check-session')
      .then((response) => {
        if (response.ok) {
          router.push('/admin/Dashboard');
        }
      })
      .catch((error) => {
        console.error('Session check error:', error);
      });
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-stone-900 to-red-900">
      <Head>
        <title>Login - MGA</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Login administrador MGA Corretora." />
      </Head>
      <form
        className="p-6 bg-gray-100 rounded-md shadow-md m-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <h1 className="text-3xl font-semibold mb-3 text-red-800">MGA Corretora Admin</h1>
        <label htmlFor="login-username" className="text-lb font-semibold ml-2">Usuário</label>
        <input
          id="login-username"
          name="username"
          autoComplete="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <label htmlFor="login-password" className="text-lb font-semibold ml-2">Senha</label>
        <input
          id="login-password"
          name="password"
          autoComplete="current-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-5 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="text-red-500 mt-2" role="alert">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
