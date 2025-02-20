document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    
    const validUsername = "sophie.bluel@test.tld";
    const validPassword = "S0phie";

    if (username === validUsername && password === validPassword) {
        window.location.href = "http://127.0.0.1:5500/index.html"; // Mettre le lien html ou autre chose ? 
    } else {
        document.getElementById('errorMessage').style.display = 'block';
    }
});
