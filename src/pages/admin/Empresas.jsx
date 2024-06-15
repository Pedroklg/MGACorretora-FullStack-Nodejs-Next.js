import Nav from './componentsDash/Nav';
import Tabela from './componentsDash/Tabela';
import { protectRoute } from '../api/utils/sessionProtection';

const AdminDashboardPage = () => {
    return (
        <div className="flex flex-col lg:flex-row overflow-auto">
            <Nav />
            <Tabela
                tipoMostrado={"Empresas"}
            />
        </div>
    );
};

export const getServerSideProps = protectRoute;

export default AdminDashboardPage;
