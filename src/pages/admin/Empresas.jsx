import Nav from './componentsDash/Nav';
import Tabela from './componentsDash/Tabela';
import { protectRoute } from '../api/utils/sessionProtection';

const AdminDashboardPage = () => {
    return (
        <div className="flex flex-col lg:flex-row overflow-auto">
            <title>Tabela Empresas</title>
            <Nav />
            <Tabela
                tipoMostrado={"Empresas"}
            />
        </div>
    );
};

export const getServerSideProps = protectRoute;

export default AdminDashboardPage;
