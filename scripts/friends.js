const friendsList = document.getElementById('friends-list');

fetch('/friends')
    .then(response => response.json())
    .then(data => {
        data.forEach(friendId => {
            // Assuming you have a way to get friend's username by ID (e.g., another API call)
            // Replace with your actual logic
            const username = getFriendUsernameById(friendId); 

            const listItem = document.createElement('li');
            listItem.textContent = username;
            friendsList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Friends list error:', error);
        // Handle the error (e.g., display an error message)
    });
