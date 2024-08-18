import { useEffect } from 'react';
import styles from './UserLayout.module.css';

const UserLayout = ({ children }) => {
    useEffect(() => {
        const handleContextMenu = (e) => {
            if (e.target.nodeName === 'IMG') {
                e.preventDefault();
            }
        };

        const handleDragStart = (e) => {
            if (e.target.nodeName === 'IMG') {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('dragstart', handleDragStart);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('dragstart', handleDragStart);
        };
    }, []);

    return <div className={styles.userLayout}>{children}</div>;
};

export default UserLayout;
