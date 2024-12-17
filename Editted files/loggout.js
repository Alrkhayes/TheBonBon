document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    window.location.href = '/login.html';
});
