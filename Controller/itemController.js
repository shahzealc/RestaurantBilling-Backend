import mongoose from "mongoose";
import { ItemModel } from "../Models/itemsModel.js";

export const addItem = async (req, res) => {
    try {
        const { restaurantId, name, category, price } = req.body;

        const newItem = new ItemModel({
            restaurantId: restaurantId,
            name: name,
            category: category,
            price: price,
            imageLocation: req.file.path
        })

        const responseItem = await newItem.save();

        res.status(201).json(responseItem);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error while adding item" });
    }
};

export const getItems = async (req, res) => {
    try {
        const restaurantId = req.query.restaurantId;
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: "Invalid restaurant ID" });
        }

        const items = await ItemModel.find({ restaurantId });

        if (!items.length) {
            return res.status(404).json({ message: "Items not found for this restaurant" });
        }

        res.status(200).json(items);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error while fetching items" });
    }
};

export const getSearchedItems = async (req, res) => {
    try {
        const restaurantId = req.query.restaurantId;
        const itemName = req.query.itemName;

        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: "Invalid restaurant IID" });
        }

        const items = await ItemModel.find({
            restaurantId: restaurantId,
            name: { $regex: new RegExp(itemName, "i") }
        });

        if (!items.length) {
            return res.status(404).json({ message: "Items not found" });
        }

        res.status(200).json(items);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error while adding item" });
    }
};

export const getCategory = async (req, res) => {
    try {
        const restaurantId = req.query.restaurantId;

        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: "Invalid restaurant ID" });
        }

        const categories = await ItemModel.find({
            restaurantId: restaurantId,
        }, { category: 1, _id: 0 });

        const uniqueCategoryNames = [...new Set(categories.map(item => item.category))];

        res.status(200).json(uniqueCategoryNames);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error while fetching category" });
    }
};

export const getCategoryItem = async (req, res) => {
    try {
        const restaurantId = req.query.restaurantId;
        const category = req.query.category;

        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: "Invalid restaurant ID" });
        }

        const items = await ItemModel.find({
            restaurantId: restaurantId,
            category: { $regex: new RegExp(category, "i") }
        });

        if (!items.length) {
            return res.status(404).json({ message: "Items not found for selected category" });
        }

        res.status(200).json(items);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error while adding item" });
    }
};

export const updateItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const updateData = req.body;

        if (!Object.keys(updateData).length) {
            return res.status(400).json({ message: "No fields provided for update" });
        }

        const updatedItem = await ItemModel.findByIdAndUpdate(itemId, updateData, {
            new: true,
        });

        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ message: "Item updated successfully", updatedItem });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error while updating item" });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const deletedItem = await ItemModel.findByIdAndDelete(itemId);
        console.log(deletedItem);

        res.status(200).json({ message: "Item deleted" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error while adding item" });
    }
};