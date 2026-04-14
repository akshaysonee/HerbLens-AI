import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import mongoose from "mongoose";

const PORT = env.PORT || 5000;

let server;

async function startServer() {
  try {
    await connectDB();

    server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
    });

    // HANDLE PORT CRASH (EADDRINUSE)
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

// GRACEFUL SHUTDOWN (important for nodemon)
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on("SIGTERM", () => {
  if (server) {
    server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
