const { Queue } = require("bullmq");

const eventQueue = new Queue("eventQueue", {
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
});

module.exports = eventQueue;