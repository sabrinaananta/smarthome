'use client';

import React, { useState, useEffect } from 'react';

function Monitoring() {
  const [data, setData] = useState({
    temperature: 'Loading...',
    humidity: 'Loading...',
    waterDetection: 'Loading...',
    motionDetection: 'Loading...',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ambil data dari API
    const fetchData = async () => {
      try {
        const response = await fetch('https://api-x-six.vercel.app/api/sensors');
        if (!response.ok) throw new Error('Failed to fetch data');

        const result = await response.json();
        console.log('API response:', result);

        if (result && result.length > 0) {
          const latestData = result[0]; // Ambil data sensor terbaru
          console.log('Latest data:', latestData);

          setData({
            temperature: latestData.temperature
              ? `${latestData.temperature} °C`
              : 'No Data',
            humidity: latestData.humidity
              ? `${latestData.humidity} %`
              : 'No Data',
            waterDetection: latestData.water_sensor === true
              ? 'Water Detected'
              : latestData.water_sensor === false
              ? 'No Water Detected'
              : 'No Data Available',
            motionDetection: latestData.motion_sensor === true
              ? 'Motion Detected'
              : latestData.motion_sensor === false
              ? 'No Motion Detected'
              : 'No Data Available',
          });
        } else {
          throw new Error('Invalid or missing data in API response');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Setiap 5 detik

    return () => clearInterval(interval); // Hentikan interval ketika komponen unmount
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section id="monitoring" className="monitoring">
      <h2>Monitoring</h2>
      <div className="card-container">
        {/* Temperature */}
        <div className="card">
          <h3>Temperature</h3>
          <img
            src="/temperature.jpg"
            alt="Temperature Sensor"
            className="sensor-image"
          />
          <p>{data.temperature}</p>
        </div>

        {/* Humidity */}
        <div className="card">
          <h3>Humidity</h3>
          <img
            src="/humidity.jpg"
            alt="Humidity Sensor"
            className="sensor-image"
          />
          <p>{data.humidity}</p>
        </div>

        {/* Water Detection */}
        <div className="card">
          <h3>Water Detection</h3>
          <img
            src="/water.jpg"
            alt="Water Sensor"
            className="sensor-image"
          />
          <p>{data.waterDetection}</p>
        </div>

        {/* Motion Detection */}
        <div className="card">
          <h3>Motion Detection</h3>
          <img
            src="/motion.jpg"
            alt="Motion Sensor"
            className="sensor-image"
          />
          <p>{data.motionDetection}</p>
        </div>
      </div>
    </section>
  );
}

export default Monitoring;
