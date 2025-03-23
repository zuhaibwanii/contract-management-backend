const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { initSocket } = require('./services/socket');
const { testSupabaseConnection } = require('./utils/index');

const PORT = process.env.PORT || 5000;

// Initialize Express app
const app = express();  
const server = http.createServer(app);

// Initialize Socket
initSocket(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Import routes
const contractRoutes = require('./routes/contracts.routes');

// Use routes
app.use('/api/contracts', contractRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


// Start server
(async () => {
  try {
    await testSupabaseConnection()
  } catch (error) {
    process.exit(1)
  }

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

})();