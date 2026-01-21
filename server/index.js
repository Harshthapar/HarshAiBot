// import required packages
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// load env variables
dotenv.config();

// create app
const app = express();

// middleware
//cors configuration
app.use(cors({
    origin: process.env.CORS ? process.env.CORS.split(",") : [
        'http://localhost:5000',
        'http://127.0.0.1:5500'
    ]
}));

//json parsing
app.use(express.json());

// import routes
import groqRoutes from "./routes/groq.routes.js";
import healthRoute from "./routes/health.route.js";


// routes declaration
app.use("/", groqRoutes);
app.use("/health", healthRoute);

// define port
const PORT = process.env.PORT || 3000;


// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});