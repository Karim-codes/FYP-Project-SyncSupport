import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import { NlpManager } from 'node-nlp';

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize the NLP manager
const manager = new NlpManager({ languages: ['en'] });

// Train the NLP manager
const trainAndSave = async () => {
    // Add training data
    manager.addDocument('en', 'hi', 'greetings');
    manager.addDocument('en', 'hello', 'greetings');
    manager.addDocument('en', 'how are you', 'greetings');

    manager.addAnswer('en', 'greetings', 'Hello! How can I assist you today?');

    // Train and save the model
    await manager.train();
    manager.save();
    console.log('NLP model trained and saved');
};

trainAndSave();

// Load the NLP model
(async () => {
    try {
        await manager.load();
        console.log('NLP model loaded');
    } catch (error) {
        console.error('Failed to load NLP model:', error);
    }
})();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

(async () => {
    try {
        const db = await connectDB();
        app.use((req, res, next) => {
            req.db = db;
            next();
        });

        // Auth routes
        app.use('/api/auth', authRoutes);

        // Chatbot endpoint
        app.post('/api/chat', async (req, res) => {
            const { message } = req.body;

            if (!message) {
                return res.status(400).json({ error: 'Message is required' });
            }

            try {
                const response = await manager.process('en', message);
                res.json({ reply: response.answer });
            } catch (error) {
                console.error('Error processing message:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
})();
