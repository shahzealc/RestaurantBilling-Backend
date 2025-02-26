import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    items: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Item",
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1,
            },
            itemTotalPrice: {
                type: Number,
                required: true,
            }
        }
    ],
    tableNumber: {
        type: Number,
        required: true,
    },
    totalOrderPrice: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

export const OrderModel = mongoose.model("Order", orderSchema);
