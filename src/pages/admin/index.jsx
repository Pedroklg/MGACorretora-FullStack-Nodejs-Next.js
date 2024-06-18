import React from 'react';
import Login from './Login';
import Head from 'next/head';

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>MGA Admin</title>
        <meta name="description" content="Pagina de administrador MGA Corretora" />
      </Head>
      <Login />
    </>
  );
};

export default Dashboard;