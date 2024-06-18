export const isLoggedIn = () => {
  // Check if the user is logged in
  const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn');
  return isAdminLoggedIn === 'true';
};
