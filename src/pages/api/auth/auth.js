export const isLoggedIn = () => {
  const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn');
  return isAdminLoggedIn === 'true';
};
