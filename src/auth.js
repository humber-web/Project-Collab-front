export function isLoggedIn() {
  // Get the user token from local storage
  const token = localStorage.getItem('user-token');

  // If there is a token, return true, else return false
  return !!token;
}