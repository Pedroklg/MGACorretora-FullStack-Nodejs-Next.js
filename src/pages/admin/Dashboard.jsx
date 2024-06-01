import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { withSession } from '../api/utils/session';
import Aside from './componentsDash/Aside';
import Tabela from './componentsDash/Tabela';
import Registrar from './Registrar';
import { ItemProvider } from './componentsDash/context/ItemContext'; // Import the ItemProvider

const AdminDashboardPage = () => {
  const [tipoMostrado, setTipoMostrado] = useState('ambos');
  const [showRegistrar, setShowRegistrar] = useState(false);
  const router = useRouter();

  const handleTipoMostradoChange = (tipo) => {
    setTipoMostrado(tipo);
    setShowRegistrar(false);
  };

  const handleRegistrarClick = () => {
    setShowRegistrar(true);
  };

  return (
    <ItemProvider> {/* Wrap the component tree with ItemProvider */}
      <div className="flex h-screen bg-red-900">
        <Aside
          handleTipoMostradoChange={handleTipoMostradoChange}
          handleRegistrarClick={handleRegistrarClick}
        />
        {showRegistrar ? (
          <Registrar />
        ) : (
          <Tabela
            tipoMostrado={tipoMostrado}
            setShowRegistrar={setShowRegistrar} // Pass setShowRegistrar as a prop
          />
        )}
      </div>
    </ItemProvider>
  );
};

export const getServerSideProps = withSession(async ({ req }) => {
  const adminLoggedIn = req.session.get('adminLoggedIn');

  if (!adminLoggedIn) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}, {
  password: process.env.SESSION_PASSWORD,
  cookieName: 'admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});

export default AdminDashboardPage;
