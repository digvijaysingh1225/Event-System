require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express(); // ✅ FIRST create app

// Middleware
app.use(cors());       // ✅ THEN use cors
app.use(express.json());

// Routes
app.use("/api", eventRoutes);
app.use("/api", analyticsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Running" });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log("Before DB connect");

    await connectDB();

    console.log("After DB connect");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server failed:", error.message);
  }
};

startServer();