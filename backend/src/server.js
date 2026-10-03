import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";

const PORT = env.PORT || 5000;

let server;

async function shutdown(signal) {
  console.log(`Received ${signal}. Shutting down server...`);

  if (!server) {
    process.exit(0);
  }

  server.close((err) => {
    if (err) {
      console.error("Error while closing server:", err);
      process.exit(1);
    }

    process.exit(0);
  });
}

async function startServer() {
  try {
    server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use`);
        console.log("👉 Kill the running server or free the port");
        process.exit(1);
      } else {
        console.error("Server error:", err);
        process.exit(1);
      }
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
