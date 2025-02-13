import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    restaurantName: {
        type: String,
        required: true,
    },
    tables: {
        type: Number,
        default: 1,
    },
    restaurantEmail: {
        type: String,
        required: true,
    },
    restaurantPassword: {
        type: String,
        required: true,
    },
    adminPassword: {
        type: String,
        required: true,
    },
    userPassword: {
        type: String,
        required: true,
    },
});

export const RestaurantModel = mongoose.model("Restaurant", restaurantSchema);
