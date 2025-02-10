import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RestaurantModel } from "../Models/restaurantModel.js";

export const login = async (req, res) => {
    const { restaurantEmail, restaurantPassword, rolePassword, role } = req.body;

    try {
        const restaurant = await RestaurantModel.findOne({ restaurantEmail: restaurantEmail });

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant email not found" });
        }

        const isRestaurantPassValid = await bcrypt.compare(restaurantPassword, restaurant.restaurantPassword);
        if (!isRestaurantPassValid) {
            return res.status(401).json({ message: "Restaurant password is incorrect" });
        }

        if (role === "admin") {
            const isAdminPassValid = await bcrypt.compare(rolePassword, restaurant.adminPassword);
            if (!isAdminPassValid) {
                return res.status(401).json({ message: "Admin password is incorrect" });
            }
        } else if (role === "user") {
            const isUserPassValid = await bcrypt.compare(rolePassword, restaurant.userPassword);
            if (!isUserPassValid) {
                return res.status(401).json({ message: "User password is incorrect" });
            }
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }

        const token = jwt.sign(
            { restaurantId: restaurant._id, role },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token, restaurantId: restaurant._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while logging in" });
    }
};

export const register = async (req, res) => {
    const { restaurantName, restaurantEmail, restaurantPassword, adminPassword, userPassword } = req.body;

    try {
        const restaurent = await RestaurantModel.find({ restaurantEmail: restaurantEmail });
        if (restaurent) {
            res.status(400).json({ message: "Restaurent email already exist" });
        }
        else {
            const restaurantPass = await bcrypt.hash(restaurantPassword, 10);
            const adminPass = await bcrypt.hash(adminPassword, 10);
            const userPass = await bcrypt.hash(userPassword, 10);

            const newRestaurant = new RestaurantModel({
                restaurantName: restaurantName,
                restaurantEmail: restaurantEmail,
                restaurantPassword: restaurantPass,
                adminPassword: adminPass,
                userPassword: userPass
            })

            await newRestaurant.save();

            res.status(200).json({ message: "Restaurant created" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error while register" });
    }
};

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        const token = authHeader.split(" ")[1]; // Extract token after "Bearer "

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

export const validateToken = (req, res) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        const token = authHeader.split(" ")[1]; // Extract token after "Bearer "

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        return res.status(200).json({ message: "Token is valid" });

    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};