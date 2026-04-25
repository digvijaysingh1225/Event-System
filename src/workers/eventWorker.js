const { Worker } = require("bullmq");
const mongoose = require("mongoose");
require("dotenv").config();

const Event = require("../models/Event");

mongoose.connect(process.env.MONGO_URI);

const worker = new Worker(
  "eventQueue",
  async (job) => {
    console.log("Processing job:", job.data);

    await Event.create(job.data);
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379
    }
  }
);

console.log("Worker started...");