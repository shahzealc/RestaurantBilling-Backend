import mongoose from "mongoose";
import { OrderModel } from "../Models/orderModel.js";
import { RestaurantModel } from "../Models/restaurantModel.js";

import mongoose from "mongoose";
import { OrderModel } from "../Models/orderModel.js";
import { ItemModel } from "../Models/itemModel.js";

export const addOrder = async (req, res) => {
    try {
        const { restaurantId, items, tableNumber } = req.body;

        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: "Invalid restaurant ID" });
        }

        // Fetch item prices from DB
        const itemIds = items.map(item => item.itemId);
        const foundItems = await ItemModel.find({ _id: { $in: itemIds } });

        if (foundItems.length !== items.length) {
            return res.status(400).json({ message: "Some items not found in the database" });
        }

        let totalOrderPrice = 0;
        const processedItems = items.map(orderItem => {
            const itemDetails = foundItems.find(i => i._id.toString() === orderItem.itemId);

            if (!itemDetails) {
                throw new Error(`Item ID ${orderItem.itemId} not found`);
            }

            const itemTotalPrice = itemDetails.price * orderItem.quantity;
            totalOrderPrice += itemTotalPrice;

            return {
                itemId: orderItem.itemId,
                quantity: orderItem.quantity,
                itemTotalPrice: itemTotalPrice
            };
        });

        const newOrder = new OrderModel({
            restaurantId,
            items: processedItems,
            tableNumber,
            totalOrderPrice
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
        const { orderId } = req.params;
        const { items } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        // Extract item IDs
        const itemIds = items.map(item => item.itemId);
        
        // Fetch item data from DB
        const itemsData = await ItemModel.find({ _id: { $in: itemIds } });

        // Check if all items exist
        if (itemIds.length !== itemsData.length) {
            return res.status(404).json({ message: "Some items not found" });
        }

        // Calculate total price
        let totalOrderPrice = 0;
        const newItems = items.map(item => {
            const itemData = itemsData.find(i => i._id.toString() === item.itemId);
            if (!itemData) return null; // Safety check

            const itemTotalPrice = itemData.price * item.quantity;
            totalOrderPrice += itemTotalPrice;

            return {
                itemId: item.itemId,
                quantity: item.quantity,
                itemTotalPrice: itemTotalPrice
            };
        }).filter(Boolean); // Remove null values

        // Update order in DB
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId, 
            { items: newItems, totalOrderPrice }, 
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order updated successfully", updatedOrder });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error while updating order" });
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