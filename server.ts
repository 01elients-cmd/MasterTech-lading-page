import { app } from './api/index.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;

// Serve static frontend files from the Vite build output
app.use(express.static(path.join(__dirname, 'dist')));

// For any non-API route, serve index.html (React client-side routing)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`MasterTech server running on port ${PORT}`);
});
