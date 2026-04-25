import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function App() {
  const [userId, setUserId] = useState("");
  const [type, setType] = useState("");
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Checking...");

  // 🔹 Send Event
  const sendEvent = async () => {
    if (!userId || !type) {
      alert("Please enter userId and type");
      return;
    }

    try {
      const res = await axios.post("/api/event", {
        userId,
        type,
      });

      alert(res.data.message || "Event queued successfully");

      setUserId("");
      setType("");

    } catch (err) {
      console.error("Send Event Error:", err);
      alert("Error sending event");
    }
  };

  // 🔹 Load Analytics
  const getAnalytics = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/analytics");

      setAnalytics(res.data.data || []);

    } catch (err) {
      console.error("Analytics Error:", err);
      alert("Error loading analytics");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Check backend status
  const checkAPI = async () => {
    try {
      await axios.get("/");
      setStatus("Backend Online");
    } catch {
      setStatus("Backend Offline");
    }
  };

  // 🔹 Auto-load analytics + status
  useEffect(() => {
    getAnalytics();
    checkAPI();

    const interval = setInterval(() => {
      getAnalytics();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1>Event Processing Dashboard</h1>
      <p>Status: {status}</p>

      {/* 🔹 Create Event */}
      <div className="card">
        <h2>Create Event</h2>

        <div className="form">
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          <input
            type="text"
            placeholder="Type (click/view)"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />

          <button onClick={sendEvent}>Send Event</button>
        </div>
      </div>

      {/* 🔹 Analytics */}
      <div className="card">
        <h2>Analytics</h2>

        <button onClick={getAnalytics}>Refresh Analytics</button>

        {loading && <p>Loading...</p>}

        <div className="analytics">
          {!loading && analytics.length === 0 && (
            <p>No data available</p>
          )}

          {analytics.map((item, index) => (
            <div key={index} className="analytics-item">
              <span>{item._id}</span>
              <span>{item.count}</span>
            </div>
          ))}
        </div>

        {/* 🔹 Chart */}
        {analytics.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <Bar
              data={{
                labels: analytics.map((item) => item._id),
                datasets: [
                  {
                    label: "Event Count",
                    data: analytics.map((item) => item.count),
                  },
                ],
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;