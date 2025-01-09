const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smarthome',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

// API Endpoints

// 1. Fetch monitoring data (ambil data sensor terakhir dari database)
app.get('/api/sensors', (req, res) => {
  const query = 'SELECT * FROM sensors ORDER BY created_at DESC LIMIT 1'; // Ambil data sensor terbaru
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sensor data from database:', err.message);
      return res.status(500).json({ error: 'Failed to fetch sensor data from database' });
    }

    if (results.length > 0) {
      console.log('Fetched sensor data:', results[0]); // Log untuk debug
      res.json({ data: results[0] });
    } else {
      console.warn('No sensor data available'); // Log jika data tidak tersedia
      res.status(404).json({ message: 'No sensor data available' });
    }
  });
});

// 2. Periodic sync (penyelarasan data setiap 5 menit)
const syncSensorsData = async () => {
  try {
    const apiResponse = await axios.get('https://api-x-six.vercel.app/api/sensors');
    const sensors = apiResponse.data;

    // Periksa jika ada data sensor sebelum insert
    if (!sensors || sensors.length === 0) {
      console.error('No data received from external API');
      return;
    }

    sensors.forEach((sensor) => {
      const query = `INSERT INTO sensors (temperature, humidity, water_sensor, motion_sensor, created_at) VALUES (?, ?, ?, ?, NOW())`;
      db.query(
        query,
        [
          sensor.temperature || null,
          sensor.humidity || null,
          sensor.water_detected ? 1 : 0,
          sensor.motion_detected ? 1 : 0,
        ],
        (err) => {
          if (err) {
            console.error('Error during periodic sync:', err.message);
          }
        }
      );
    });

    console.log('Periodic sensor data sync completed');
  } catch (error) {
    console.error('Error during periodic sensor data sync:', error.message);
  }
};

// Jadwalkan sinkronisasi setiap 5 menit
setInterval(syncSensorsData, 5 * 60 * 1000);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
