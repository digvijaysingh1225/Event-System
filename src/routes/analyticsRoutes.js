const express = require("express");
const router = express.Router();

const Event = require("../models/Event");
const redis = require("../config/redis");

router.get("/analytics", async (req, res) => {
  try {
    const cacheKey = "analytics";

    // 🔹 Step 1: Check cache
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log("Serving from cache");
      return res.json({
        success: true,
        source: "cache",
        data: JSON.parse(cachedData)
      });
    }

    // 🔹 Step 2: Fetch from DB
    console.log("Fetching from DB");

    const result = await Event.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      }
    ]);

    // 🔹 Step 3: Store in Redis (TTL = 60 sec)
    await redis.set(cacheKey, JSON.stringify(result), "EX", 60);

    res.json({
      success: true,
      source: "db",
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;