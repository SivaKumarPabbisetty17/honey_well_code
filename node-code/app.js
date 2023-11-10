const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Endpoint to receive the shortest path from the frontend
app.post('/api/shortest-path', (req, res) => {
  const shortestPath = req.body.shortestPath;

  // Process the shortestPath as needed
  console.log('Shortest Path:', shortestPath);

  // Respond with a success message
  res.json({ message: 'Shortest path received successfully.' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
