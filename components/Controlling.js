'use client';

import React, { useState, useEffect } from 'react';

function Controlling() {
  const [controls, setControls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data terbaru dari API
    const fetchSensorData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sensors');
        const data = await response.json();
        console.log("API response:", data);

        if (data.data) {
          setControls([
            {
              id: 1,
              name: 'Door Lock',
              status: data.data.door_locked === 1,
              type: 'door_locked',
            },
            {
              id: 2,
              name: 'Door',
              status: data.data.door === 1,
              type: 'door',
            },
            {
              id: 3,
              name: 'Light',
              status: data.data.lamp === 1,
              type: 'lamp',
            },
          ]);
        } else {
          throw new Error('Invalid or missing data in API response');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
        setLoading(false);
      }
    };

    fetchSensorData();
  }, []);

  const updateControl = async (controlType, action, index) => {
    setControls((prev) =>
      prev.map((control, i) =>
        i === index ? { ...control, loading: true } : control
      )
    );

    try {
      const response = await fetch('http://localhost:5000/api/controls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          control_type: controlType,
          action: action, // 'on' atau 'off'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setControls((prev) =>
          prev.map((control, i) =>
            i === index
              ? { ...control, status: action === 'on', loading: false }
              : control
          )
        );
      } else {
        alert(data.error || 'Failed to execute action');
        setControls((prev) =>
          prev.map((control, i) =>
            i === index ? { ...control, loading: false } : control
          )
        );
      }
    } catch (error) {
      console.error('Error triggering control:', error);
      setControls((prev) =>
        prev.map((control, i) =>
          i === index ? { ...control, loading: false } : control
        )
      );
    }
  };

  return (
    <section id="controlling" className="controlling">
      <h2>Controlling</h2>
      <div className="toggle-container">
        {loading ? (
          <span>Loading sensor data...</span>
        ) : (
          controls.map((control, index) => (
            <div key={control.id} className="control-item">
              {/* Menampilkan nama tombol di atas toggle */}
              <div className="control-name">{control.name}</div>

              {/* Tempatkan tombol toggle di bawah */}
              <div
                className="toggle"
                onClick={() =>
                  !control.loading &&
                  updateControl(control.type, control.status ? 'off' : 'on', index)
                }
                data-active={control.status}
                style={{
                  opacity: control.loading ? 0.5 : 1,
                  pointerEvents: control.loading ? 'none' : 'auto',
                }}
              >
                {control.loading ? (
                  <span>Loading...</span>
                ) : (
                  <span>{control.status ? 'On' : 'Off'}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Controlling;
