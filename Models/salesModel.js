import mongoose, { mongo } from "mongoose";

const salesSchema = new mongoose.Schema({

    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Restaurant",
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
    totalOrderPrice: {
        type: Number,
        required: true,
    },
    discount: {
        type: String,
        required: false,
        default: null
    },
    coupon: {
        type: String,
        required: false,
        default: null
    },
    finalPrice: {
        type: Number,
        require: true,
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Payment"
    }
});

export const SalesModel = mongoose.Model("Sales", salesSchema);