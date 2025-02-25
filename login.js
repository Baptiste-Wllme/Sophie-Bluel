document.getElementById('loginForm').addEventListener('submit', async function(event) { // ajout d'un evènement de type submit, async parce que atttend une réponse de la fonction
    event.preventDefault();                                                             // pour empêcher de rechargement de la page

    const username = document.getElementById('username').value; // récupération de la valeur de ID
    const password = document.getElementById('password').value; // récupération de la valeur de MDP

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {       // création de la const response dans l'attente ( await) de la confirmation du fetch
            method: 'POST',                                                           // Post pour envoyé la donnée
            headers: {
                'Accept': 'application/json',                                         // réception en format json
                'Content-Type': 'application/json'                                    // envoie sous format json
            },
            body: JSON.stringify({ email: username, password: password })             // convertit l'objet 'email et password en JSOn
        });

        const data = await response.json();                                           // création const data dans l'attente de response.json

        if (response.ok) {
            
            window.localStorage.setItem('token', data.token);                                // ?? pas compris //
            window.location.href = "index.html";                                       // ? Redirection vers la page index.html ou sur le le lien ? 
        } else {
                                                                                       // Si c'est inccorect, envoie du message d'erreurr
            document.getElementById('errorMessage').textContent ="L'identifiant ou le mot de passe est incorrect"; 
            document.getElementById('errorMessage').style.display = 'block';               // pour faire apparaitre le message d'erreur
        }
    } catch (error) {                                                                    // catch est utiliser après " try", il estl à si try ne s'éxecute pas
        console.error("Erreur de connexion :", error);
        document.getElementById('errorMessage').textContent = "Une erreur s'est produite.";
        document.getElementById('errorMessage').style.display = 'block';
    }
});



