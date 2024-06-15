import { withSession } from './session';

export const protectRoute = withSession(async ({ req }) => {
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
