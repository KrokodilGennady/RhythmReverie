function submitScore(scoreData) {
  // scoreData should be an object with the following properties:
  // - userId: ID of the user
  // - beatmapId: ID of the beatmap
  // - score: the score achieved
  // - accuracy: the accuracy achieved
  // - maxCombo: the maximum combo achieved
  // - mods: the mods used (string)

  fetch('/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scoreData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      // (Optional) Handle the successful response from the server (e.g., update UI)
      console.log('Score submitted successfully');
    })
    .catch(error => {
      console.error('Error submitting score:', error);
      // Handle the error (e.g., display an error message)
    });
}
