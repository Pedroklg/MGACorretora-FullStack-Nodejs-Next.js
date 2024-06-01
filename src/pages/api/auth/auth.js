export const isLoggedIn = () => {
  // Check if the user is logged in
  const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn'); // Assuming you're using session storage
  return isAdminLoggedIn === 'true';
};
