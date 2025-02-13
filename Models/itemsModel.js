import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Restaurant",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageLocation: {
        type: String,
        default: null,
    }
});

export const ItemModel = mongoose.model("Item", itemSchema);
