"use client"; // Make sure to indicate this is a client-side component

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import Monitoring from "../components/Monitoring";


// Komponen untuk jam
const Clock = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="clock-box">
      <img src="/clock-icon.jpg" alt="Clock Icon" className="icon" />
      <div className="clock-text">
        <h3>Time</h3>
        <p>{time}</p>
      </div>
    </div>
  );
};

// Komponen untuk kalender
const Calendar = () => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(date);
  }, []);

  return (
    <div className="calendar-box">
      <img src="/calender-icon.jpg" alt="Calendar Icon" className="icon" />
      <div className="calendar-text">
        <h3>Date</h3>
        <p>{currentDate}</p>
      </div>
    </div>
  );
};

// Dynamic import to avoid hydration errors
const DynamicClock = dynamic(() => Promise.resolve(Clock), { ssr: false });
const DynamicCalendar = dynamic(() => Promise.resolve(Calendar), { ssr: false });

export default function Home() {
  return (
    <>
      <header>
        <h1>Real-Time Insights for a Smarter Living</h1>
      </header>
      <div className="content">
        <div className="main-section">
          <Monitoring />
        </div>

        <div className="image-container">
          <div className="image-box">
            <img src="/home1.jpg" alt="Home" />
            <div className="image-caption left-aligned">
              <h3>HOME</h3>
              <p>Jalan Sariindah 12 No 9</p>
            </div>

            {/* Kalender dan jam di pojok kanan bawah gambar */}
            <div className="info-overlay">
              <DynamicCalendar />
              <DynamicClock />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
