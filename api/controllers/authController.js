import userModel from '../models/userModel.js';

export const signup = async (req, res) => {
    const { userName, password } = req.body;
    const usersCollection = userModel(req.db);

    try {
        const existingUser = await usersCollection.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists. Please choose another one." });
        }

        await usersCollection.insertOne({ userName, password });
        res.status(201).json({ message: "User signed up successfully" });
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ message: "Error signing up. Please try again later." });
    }
};

export const login = async (req, res) => {
    const { userName, password } = req.body;
    const usersCollection = userModel(req.db);

    try {
        const user = await usersCollection.findOne({ userName });
        if (!user) {
            return res.status(400).json({ message: "User not found. Please check your username and try again." });
        }

        if (password !== user.password) {
            return res.status(400).json({ message: "Incorrect password. Please try again." });
        }

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Error logging in. Please try again later." });
    }
};
