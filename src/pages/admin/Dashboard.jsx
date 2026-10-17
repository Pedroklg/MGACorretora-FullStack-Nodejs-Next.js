import Nav from '@/components/admin/Nav';
import Tabela from '@/components/admin/Tabela';
import { protectRoute } from '@/lib/session';
import Head from 'next/head';

const AdminDashboardPage = () => {
    return (
        <div className="flex flex-col lg:flex-row overflow-auto">
            <Head>
                <title>Dashboard - MGA Corretora</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="description" content="Acesse o dashboard administrativo da MGA Corretora. Gerencie empresas e imóveis." />
            </Head>
            <Nav />
            <Tabela
                tipoMostrado={"ambos"}
            />
        </div>
    );
};

export const getServerSideProps = protectRoute;

export default AdminDashboardPage;
