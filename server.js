import { createApp } from "@wearesage/static";

createApp({
  port: process.env.PORT || 2223,
  directory: "dist",
  apiUrl: process.env.VITE_API_BASE_URL || "http://127.0.0.1:2223"
});
