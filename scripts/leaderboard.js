const leaderboardTable = document.getElementById('leaderboard-table').getElementsByTagName('tbody')[0];

fetch('/leaderboard')
    .then(response => response.json())
    .then(data => {
        data.forEach((entry, index) => {
            const row = leaderboardTable.insertRow();
            row.insertCell().textContent = index + 1; 
            row.insertCell().textContent = entry.username;
            row.insertCell().textContent = entry.score;
            row.insertCell().textContent = entry.accuracy;
            row.insertCell().textContent = entry.max_combo;
            row.insertCell().textContent = entry.mods;
            row.insertCell().textContent = entry.date_achieved;
        });
    })
    .catch(error => {
        console.error('Leaderboard error:', error);
        // Handle the error (e.g., display an error message)
    });
