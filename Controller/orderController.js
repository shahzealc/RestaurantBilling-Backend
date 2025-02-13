import mongoose from "mongoose";
import { OrderModel } from "../Models/orderModel.js";
import { RestaurantModel } from "../Models/restaurantModel.js";

export const addOrder = async (req, res) => {
    try {
        const { restaurantId, items, tableNumber } = req.body;

        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: "Invalid restaurant ID" });
        }

        const newOrder = new OrderModel({
            restaurantId: restaurantId,
            items: items,
            tableNumber: tableNumber
        });

        const responseOrder = await newOrder.save();

        res.status(201).json(responseOrder);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error while adding order" });
    }
};

export const getOrder = async (req, res) => {
    try {
        const orderId = req.query.orderId;
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const order = await OrderModel.findById(orderId);

        if (!order.length) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error while fetching order" });
    }
};

export const getOrders = async (req, res) => {
    try {
        const restaurantId = req.query.restaurantId;
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: "Invalid restaurant ID" });
        }

        const orders = await OrderModel.find({ restaurantId: restaurantId });

        if (!orders.length) {
            return res.status(404).json({ message: "Orders not found" });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error while fetching order" });
    }
};

export const getEmptyTable = async (req, res) => {
    try {
        const restaurantId = req.query.restaurantId;
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: "Invalid restaurant ID" });
        }

        const tables = await OrderModel.find({ restaurantId }, { tableNumber: 1, _id: 0 });

        const restaurant = await RestaurantModel.findById(restaurantId, { tables: 1, _id: 0 });

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const totalTables = restaurant.tables;
        const occupiedTables = tables.map(t => t.tableNumber);

        const emptyTables = [];
        for (let i = 1; i <= totalTables; i++) {
            if (!occupiedTables.includes(i)) {
                emptyTables.push(i);
            }
        }

        res.status(200).json(emptyTables);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error while fetching items" });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { itemId } = req.params;
        const updateData = req.body;

        if (!Object.keys(updateData).length) {
            return res.status(400).json({ message: "No fields provided for update" });
        }

        const updatedOrder = await OrderModel.findByIdAndUpdate(itemId, updateData, {
            new: true,
        });

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order updated successfully", updatedOrder });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error while updating item" });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const removedOrder = await OrderModel.findByIdAndDelete(orderId);
        //had to transfer the removed order to totalsales model 
        res.status(200).json({ message: "Order removed" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error while removing order" });
    }
};