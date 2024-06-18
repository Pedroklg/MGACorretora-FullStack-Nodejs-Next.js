import { useRouter } from 'next/router';
import UserLayout from '../components/UserLayout';
import AdminLayout from '../components/AdminLayout';
import '../styles/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const isUserPage = !router.pathname.startsWith('/admin');

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {isUserPage ? (
        <UserLayout>
          <Component {...pageProps} />
        </UserLayout>
      ) : (
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      )}
    </>
  );
}

export default MyApp;
