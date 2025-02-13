const express = require("express");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes.js");
const itemRoutes = require("./Routes/itemRoutes.js");
const { validateToken, verifyToken } = require("./Controller/authController.js");
const { connectMongoose } = require("./config/dbconnect");
const app = express();

require("dotenv").config();

const corsOptions = {
    origin: "*", // Set allowed origin
    methods: "*",
    credentials: true, // Allow cookies/auth headers
    optionsSuccessStatus: 200
};

connectMongoose();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/item", verifyToken, itemRoutes);
app.use("/validateToken", validateToken);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
