const express = require("express");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes.js");
require("dotenv").config();
const mongoose = require("mongoose");
const { validateToken } = require("./Controller/authController.js");
const app = express();

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

const corsOptions = {
    origin: "*", // Set allowed origin
    methods: "*",
    credentials: true, // Allow cookies/auth headers
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/validateToken", validateToken);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
