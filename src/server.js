// server.js
import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine.js"; // Cấu hình EJS
import initWebRoutes from "./route/web.js";       // Nạp routes
import connectDB from "./config/configdb.js";     // file MongoDB mới
import dotenv from "dotenv";

dotenv.config(); // nạp .env

let app = express();

// -----------------------------
// Cấu hình Express
// -----------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình View Engine
viewEngine(app);

// Cấu hình Web Routes
initWebRoutes(app);

// Kết nối MongoDB
connectDB();

// -----------------------------
// Chạy server
// -----------------------------
let port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log(" Backend Node.js is running on port: " + port);
});