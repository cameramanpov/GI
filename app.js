// L'URL de ton MockAPI
const apiUrl = 'https://66e5a21d5cc7f9b6273dec1d.mockapi.io/messages';

// Fonction pour récupérer les messages
async function fetchMessages() {
    try {
        const response = await fetch(apiUrl);
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
        const response = await fetch(apiUrl, {
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

// Gestion du formulaire d'envoi de message
document.getElementById('messageForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Empêche la soumission normale du formulaire

    const author = document.getElementById('author').value;
    const message = document.getElementById('message').value;

    if (author && message) {
        sendMessage(author, message); // Appel de la fonction pour envoyer le message
    }

    // Vider les champs du formulaire
    document.getElementById('author').value
