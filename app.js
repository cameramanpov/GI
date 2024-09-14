const maxMessages = 50; // Nombre maximum de messages autorisés
const maxUsers = 50; // Nombre maximum d'utilisateurs autorisés

const messagesUrl = 'https://66e5a21d5cc7f9b6273dec1d.mockapi.io/messages';
const usersUrl = 'https://66e5a21d5cc7f9b6273dec1d.mockapi.io/users';

let currentUser = null;

// Vérifier si les messages sont pleins
async function checkMessagesCapacity() {
    try {
        const response = await fetch(messagesUrl);
        const messages = await response.json();
        return messages.length < maxMessages;
    } catch (error) {
        console.error('Erreur lors de la vérification des messages :', error);
        return false;
    }
}

// Vérifier si les utilisateurs sont pleins
async function checkUsersCapacity() {
    try {
        const response = await fetch(usersUrl);
        const users = await response.json();
        return users.length < maxUsers;
    } catch (error) {
        console.error('Erreur lors de la vérification des utilisateurs :', error);
        return false;
    }
}

// Vérifier si le pseudo est déjà utilisé
async function isUsernameTaken(username) {
    try {
        const response = await fetch(usersUrl);
        const users = await response.json();
        return users.some(user => user.username === username);
    } catch (error) {
        console.error('Erreur lors de la vérification du pseudo :', error);
        return true; // En cas d'erreur, considérons le pseudo comme pris pour éviter les inscriptions
    }
}

// Fonction pour récupérer les messages
async function fetchMessages() {
    try {
        const response = await fetch(messagesUrl);
        const messages = await response.json();

        const messageList = document.getElementById('messageList');
        messageList.innerHTML = ''; // Vider la liste avant d'ajouter les nouveaux messages

        messages.forEach(message => {
            const li = document.createElement('li');

            const authorSpan = document.createElement('span');
            authorSpan.className = 'message-author';
            // Ajouter la classe 'admin' si l'auteur est un admin
            if (message.author === 'admin') {
                authorSpan.classList.add('admin');
            }
            authorSpan.textContent = `${message.author} (${message.timestamp})`;

            const contentSpan = document.createElement('span');
            contentSpan.className = 'message-content';
            contentSpan.textContent = message.message;

            li.appendChild(authorSpan);
            li.appendChild(contentSpan);

            messageList.appendChild(li);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
    }
}

// Fonction pour envoyer un message
async function sendMessage(author, message) {
    const timestamp = new Date().toISOString();
    const data = { author, message, timestamp };

    if (!await checkMessagesCapacity()) {
        alert('La capacité des messages est pleine. Impossible d\'envoyer de nouveaux messages.');
        return;
    }

    try {
        const response = await fetch(messagesUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            fetchMessages(); // Recharger les messages
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
        const response = await fetch(usersUrl);
        const users = await response.json();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            currentUser = user;
            document.getElementById('author').value = currentUser.username;
            document.getElementById('messageForm').style.display = 'block'; // Afficher le formulaire de messages
            document.getElementById('authButtons').style.display = 'none';  // Masquer les boutons de connexion
            document.getElementById('loginForm').style.display = 'none';    // Masquer le formulaire de connexion

            // Si l'utilisateur est un admin, affiche son pseudo en rouge
            if (currentUser.role === 'admin') {
                document.getElementById('author').style.color = 'red';
            }

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
    if (!await checkUsersCapacity()) {
        alert('La capacité des utilisateurs est pleine. Impossible de créer de nouveaux comptes.');
        return;
    }

    if (await isUsernameTaken(username)) {
        alert('Le pseudo est déjà utilisé. Choisissez-en un autre.');
        return;
    }

    const newUser = { username, password, role: 'user' };  // Par défaut, tout le monde est 'user'

    try {
        const response = await fetch(usersUrl, {
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

// Gérer le formulaire d'envoi de message
document.getElementById('sendMessageBtn').addEventListener('click', function () {
    const author = currentUser ? currentUser.username : null;
    const message = document.getElementById('message').value;

    if (author && message) {
        sendMessage(author, message); // Appel de la fonction pour envoyer le message
    } else {
        alert('Vous devez être connecté pour envoyer un message.');
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
