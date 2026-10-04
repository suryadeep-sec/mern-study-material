require("dotenv").config();
const express = require("express");
const cors = require("cors");
const materialRoutes = require("./routes/material");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const assignmentRoutes = require("./routes/assignments");


const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
    
app.get("/", (req, res) => {
  res.json({
    message: "College Study Hub API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/material", materialRoutes);
app.use("/api/assignments", assignmentRoutes);
async function startServer() {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();

