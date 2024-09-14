// L'URL de ton MockAPI pour les messages et les utilisateurs
const apiUrlMessages = 'https://66e5a21d5cc7f9b6273dec1d.mockapi.io/messages';
const apiUrlUsers = 'https://66e5a21d5cc7f9b6273dec1d.mockapi.io/users';

// Variables pour stocker l'utilisateur connecté
let currentUser = null;

// Fonction pour récupérer les messages
async function fetchMessages() {
    try {
        const response = await fetch(apiUrlMessages);
        const messages = await response.json();

        // Afficher les messages dans la liste
        const messageList = document.getElementById('messageList');
        messageList.innerHTML = ''; // Vider la liste avant d'ajouter les nouveaux messages

        messages.forEach(message => {
            const li = document.createElement('li');
            li.textContent = `${message.author} (${message.timestamp}): ${message.message}`;
            messageList.appendChild(li);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
    }
}

// Fonction pour envoyer un nouveau message
async function sendMessage(author, message) {
    const timestamp = new Date().toISOString();
    const data = { author, message, timestamp };

    try {
        const response = await fetch(apiUrlMessages, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            // Message envoyé avec succès, rafraîchir la liste des messages
            fetchMessages();
        } else {
            console.error('Erreur lors de l\'envoi du message');
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message :', error);
    }
}

// Fonction pour gérer la connexion
async function login(username, password) {
    try {
        const response = await fetch(apiUrlUsers);
        const users = await response.json();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            currentUser = user;
            document.getElementById('author').value = currentUser.username;
            document.getElementById('messageForm').style.display = 'block'; // Afficher le formulaire de messages
            document.getElementById('authButtons').style.display = 'none';  // Masquer les boutons de connexion
            document.getElementById('loginForm').style.display = 'none';    // Masquer le formulaire de connexion
            alert('Connexion réussie');
        } else {
            alert('Identifiants incorrects');
        }
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
    }
}

// Fonction pour gérer l'inscription
async function signup(username, password) {
    const newUser = { username, password };

    try {
        const response = await fetch(apiUrlUsers, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        if (response.ok) {
            alert('Inscription réussie. Vous pouvez maintenant vous connecter.');
            document.getElementById('signupForm').style.display = 'none'; // Masquer le formulaire d'inscription
        } else {
            console.error('Erreur lors de l\'inscription');
        }
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
    }
}

// Gestion du formulaire d'envoi de message
document.getElementById('messageForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Empêche la soumission normale du formulaire

    const author = currentUser.username;
    const message = document.getElementById('message').value;

    if (message) {
        sendMessage(author, message); // Appel de la fonction pour envoyer le message
    }

    // Vider le champ du message
    document.getElementById('message').value = '';
});

// Gestion de la connexion
document.getElementById('loginBtn').addEventListener('click', function () {
    document.getElementById('loginForm').style.display = 'block'; // Afficher le formulaire de connexion
});

document.getElementById('loginSubmit').addEventListener('click', function () {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    login(username, password);
});

// Gestion de l'inscription
document.getElementById('signupBtn').addEventListener('click', function () {
    document.getElementById('signupForm').style.display = 'block'; // Afficher le formulaire d'inscription
});

document.getElementById('signupSubmit').addEventListener('click', function () {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    signup(username, password);
});

// Charger les messages au démarrage de la page
fetchMessages();
