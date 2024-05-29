import { withSession } from '../api/utils/session';
import Aside from './componentsDash/Aside';
import Tabela from './componentsDash/Tabela';

const AdminDashboardPage = () => {
  return (
    <div className="flex h-screen bg-red-900">
      <Aside />
      <Tabela tipoMostrado="ambos" />
    </div>
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