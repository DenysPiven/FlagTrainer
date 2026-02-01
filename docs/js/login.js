document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const userId = document.getElementById('userId').value.trim();
    
    if (!userId || !userId.match(/^[A-Za-z]+$/)) {
        alert('Username should only contain Latin letters. No spaces allowed.');
        return;
    }
    
    // Save userId to sessionStorage
    sessionStorage.setItem('userId', userId);
    
    // Redirect to index page
    window.location.href = 'index.html';
});
