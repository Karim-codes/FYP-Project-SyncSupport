import mongodb from 'mongodb';
const { MongoClient } = mongodb;

const uri = "mongodb+srv://dbkarim:Miirak17@cluster0.os5qpdf.mongodb.net/Cluster0?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connectDB = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB.");
        return client.db("Cluster0");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

export default connectDB;
