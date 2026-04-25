const eventQueue = require("../services/queue");
const redis = require("../config/redis");

const createEvent = async (req, res) => {
  try {
    await eventQueue.add("eventJob", req.body);
    await redis.del("analytics"); // invalidate cache

    res.status(201).json({
      success: true,
      message: "Event queued successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createEvent };