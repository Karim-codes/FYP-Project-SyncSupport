import express from 'express'
import { Server } from "socket.io"
import { NlpManager } from 'node-nlp';
import bodyParser from 'body-parser';
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from "bcrypt";
import mongodb from 'mongodb';

const { MongoClient } = mongodb;

const manager = new NlpManager({ languages: ['en'], forceNER: true });

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const app = express()
const PORT = process.env.PORT || 3000
const ADMIN = "Admin"

const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use(express.json());

const uri = "mongodb+srv://dbkarim:Miirak17@cluster0.os5qpdf.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const dbName = 'Cluster0';
const collectionName = 'chatbotData';  

async function insertChatbotData() {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    //intents inserted
     const intents = [
    //     {
    //         "intent": "problem.monitor",
    //         "language": "en",
    //         "phrases": ["My monitor is not turning on", "Monitor issues", "Screen won't display", "My screen is black"],
    //         "responses": ["Have you tried checking the power cables or trying a different power outlet?"]
    //     },
    //     {
    //         "intent": "problem.monitor.yes",
    //         "language": "en",
    //         "phrases": ["Yes", "It worked", "That solved it"],
    //         "responses": ["Great to hear that! Do you need help with anything else?"]
    //     },
    //     {
    //         "intent": "problem.monitor.no",
    //         "language": "en",
    //         "phrases": ["No", "It didn't work", "Still not working"],
    //         "responses": ["It might working try turning it on by remote on button on screen. Or it might be a hardware issue. Please check if your monitor is under warranty or consider taking it to a service center."]
    //     }
     ];
    //const intents = [
         {
        //     "intent": "how.to.print",
        //     "language": "en",
        //     "phrases": ["how to print", "how can I print"],
        //     "responses": ["Are you printing through Word or PDF"]
        // },
        // {
        //     "intent": "how.to.print.Word",
        //     "language": "en",
        //     "phrases": ["Word", "word"],
        //     "responses": ["Okay perfect! On your Word document, click File, then choose 'Print' then adjust paper size and orientation. If the document is correct press 'Print' !"]
        // },
        // {
        //     "intent": "how.to.print.PDF",
        //     "language": "en",
        //     "phrases": ["PDF", "pdf"],
        //     "responses": ["Okay perfect! On your PDF file, click File, then choose 'Print' then adjust paper size and orientation. If the file is correct, press 'Print' !"]
        // },
        // {
        //     "intent": "how.to.print.worked",
        //     "language": "en",
        //     "phrases": ["worked", "working", "all working"],
        //     "responses": ["Ayyy, glad to hear that! Anything I can help with?."]
         }
   //];

    for (let intentData of intents) {
        const { intent, language } = intentData;
        const existingIntent = await collection.findOne({ intent, language });
        if (!existingIntent) {
            await collection.insertOne(intentData);
            console.log(`Inserted '${intent}' intent into MongoDB.`);
        } else {
            console.log(`Intent '${intent}' already exists in MongoDB.`);
        }
    }
}

async function loadTrainingData() {
    try {
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const documents = await collection.find().toArray();

        for (let doc of documents) {
            if (doc.phrases && doc.responses) {
                doc.phrases.forEach(phrase => manager.addDocument(doc.language, phrase, doc.intent));
                doc.responses.forEach(response => manager.addAnswer(doc.language, doc.intent, response));
            }
        }
        await manager.train();
        manager.save();
        console.log("NLP model trained and saved.");
    } catch (error) {
        console.error("Error loading training data:", error);
    }
}

(async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB.");
        await insertChatbotData();
        await loadTrainingData();
    } finally {
        
    }
})();


app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    try {
        const response = await manager.process('en', userMessage);
        const botResponse = response.answer || "I'm sorry, I don't understand your message.";
        res.json({ message: botResponse });
    } catch (error) {
        console.error('Error processing the chat message:', error);
        res.json({ message: "There was an error processing your message." });
    }
});



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public/home.html"));
});

app.get("/aboutUs", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public/aboutUs.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public/Login.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public/signup.html"));
});

app.get("/chatbot", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public/chatbot.html"));
});

app.get("/real-user", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public/chat-real-user.html"));
});






app.post("/signup", async (req, res) => {
    const { userName, password } = req.body;
    try {
        const db = client.db("Cluster0");
        const usersCollection = db.collection("users_accounts");
        
        const existingUser = await usersCollection.findOne({ userName });
        if (existingUser) {
            return res.send("Username already exists. Please choose another one.");
        }
        
        await usersCollection.insertOne({ userName, password });

        res.redirect("/login.html");
        console.log("user " + userName + " signed up in succesfully")
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).send("Error signing up. Please try again later.");
    }
});

app.post("/login", async (req, res) => {
    const { userName, password } = req.body;

    try {
        const db = client.db("Cluster0");
        const usersCollection = db.collection("users_accounts");

        const user = await usersCollection.findOne({ userName });
        if (!user) {
            return res.send("User not found. Please check your username and try again.");
        }

        if (password !== user.password) {
            return res.send("Incorrect password. Please try again.");
        }

        
        console.log("user " + userName + " logged in succesfully")
        res.redirect("home.html");
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Error logging in. Please try again later.");
    }
});

app.get("/logout", (req, res) => {
    // Clear any session-related data
    // For example, if you're using session tokens or cookies, you would clear them here

    // Redirect to the login page after logout
    res.redirect("/login.html");
});



const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "port 3000" ? false : 
        ["http://localhost:3000",]
    }
})

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`)

    
    socket.emit('message', buildMsg(ADMIN, "Welcome to SyncSupport Chat Service!"))

    socket.on('enterRoom', ({ name, room }) => {

      
        const prevRoom = getUser(socket.id)?.room

        if (prevRoom) {
            socket.leave(prevRoom)
            io.to(prevRoom).emit('message', buildMsg(ADMIN, `${name} has left the room`))
        }

        const user = activateUser(socket.id, name, room)

        if (prevRoom) {
            io.to(prevRoom).emit('userList', {
                users: getUsersInRoom(prevRoom)
            })
        }

        socket.join(user.room)

        socket.emit('message', buildMsg(ADMIN, `You have joined the ${user.room} chat room`))

        socket.broadcast.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has joined the room`))
    
        io.to(user.room).emit('userList', {
            users: getUsersInRoom(user.room)
        })

        io.emit('roomList', {
            rooms: getAllActiveRooms()
        })
    })

    socket.on('disconnect', () => {
        const user = getUser(socket.id)
        userLeavesApp(socket.id)

        if (user) {
            io.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has left the room`))

            io.to(user.room).emit('userList', {
                users: getUsersInRoom(user.room)
            })

            io.emit('roomList', {
                rooms: getAllActiveRooms()
            })
        }

        console.log(`User ${socket.id} disconnected`)
    })

    socket.on('message', ({ name, text }) => {
        const room = getUser(socket.id)?.room
        if (room) {
            io.to(room).emit('message', buildMsg(name, text))
        }
        saveChatMessage({ room, name, text });
    })

    async function saveChatMessage({ room, name, text }) {
        try {
            const db = client.db("Cluster0");
            const chatMessagesCollection = db.collection("chat_messages");
    
            const messageDocument = {
                room,name,text,
                timestamp: new Date()
            };
    
            await chatMessagesCollection.insertOne(messageDocument);
            console.log("Chat message saved to database.");
        } catch (error) {
            console.error("Failed to save chat message:", error);
        }
    }
    

    socket.on('activity', (name) => {
        const room = getUser(socket.id)?.room
        if (room) {
            socket.broadcast.to(room).emit('activity', name)
        }
    })
})

function buildMsg(name, text) {
    return {
        name,
        text,
        time: new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(new Date())
    }
}

const UsersState = {
    users: [],
    setUsers: function(newUsers) {
      this.users = newUsers;
    }
  };
  


function activateUser(id, name, room) {
    const user = { id, name, room }
    UsersState.setUsers([
        ...UsersState.users.filter(user => user.id !== id),
        user
    ])
    return user
}

function userLeavesApp(id) {
    UsersState.setUsers(
        UsersState.users.filter(user => user.id !== id)
    )
}

function getUser(id) {
    return UsersState.users.find(user => user.id === id)
}

function getUsersInRoom(room) {
    return UsersState.users.filter(user => user.room === room)
}

function getAllActiveRooms() {
    return Array.from(new Set(UsersState.users.map(user => user.room)))
}

export default app;






// //Add documents
// //Greetings
// manager.addDocument('en', 'gooddbye for now', 'greetings.bye');
// manager.addDocument('en', 'bye bye take care', 'greetings.bye');
// manager.addDocument('en', 'okay see you later', 'greetings.bye');
// manager.addDocument('en', 'bye for now', 'greetings.bye');
// manager.addDocument('en', 'i must go', 'greetings.bye');
// manager.addDocument('en', 'hello', 'greetings.hello');
// manager.addDocument('en', 'hi', 'greetings.hello');
// manager.addDocument('en', 'wag1', 'greetings.wag1');


// //Arabic training data
// manager.addDocument('en', 'مرحبا', 'greetingar');
// manager.addDocument('en', 'اهلا', 'greetingar');
// manager.addDocument('en', 'من هو محمد الشيخ', 'moha-ar');

// //Arabic response
// manager.addAnswer('en', 'greetingar', 'مرحبا! كيف يمكنني مساعدتك؟');
// manager.addAnswer('en', 'moha-ar', 'هو مصري عايش في بريطانيا و يعمل في ما يسمى مايتريكس');

// // question
// manager.addDocument('en', 'how many languages do you speak', 'bot.languages');

// // response
// manager.addAnswer('en', 'bot.languages', 'I speak English and Arabic.');


// // Greeting Train also the NLG Answers
// manager.addAnswer('en', 'greetings.bye', 'Till next time');
// manager.addAnswer('en', 'greetings.bye', 'see you soon!');
// manager.addAnswer('en', 'greetings.hello', 'Hey there!');
// manager.addAnswer('en', 'greetings.hello', 'Greetings!');
// manager.addAnswer('en', 'greetings.wag1', 'wag2 g!');


// // Add document for 'I need help'
// manager.addDocument('en', 'I need help', 'help.request');

// // Add answer for 'I need help'
// manager.addAnswer('en', 'help.request', 'How can I help?');

// // Add document for 'my screen is not turning on'
// manager.addDocument('en', 'my screen is not turning on', 'issue.screen.off');

// // Add answer for 'my screen is not turning on'
// manager.addAnswer('en', 'issue.screen.off', 'It sounds like your screen is having trouble. Have you tried checking the power connection or restarting your device?');

// // Correctly handle a "no" response to the screen troubleshooting
// manager.addDocument('en', 'no', 'issue.screen.off.no');
// manager.addAnswer('en', 'issue.screen.off.no', 'Try checking if the power connection is plugged in properly and the power source is working.');

// // Add document for the monitor issue
// manager.addDocument('en', 'my monitor is plugged in and still not working', 'issue.monitor.notworking');

// // Add answer for the monitor issue
// manager.addAnswer('en', 'issue.monitor.notworking', 'It seems like there might be an issue with your monitor or connection. Have you tried using a different cable or port? Sometimes, the problem could be with the cable or the port itself.');


// // Add more documents for different IT issues along with responses
// manager.addDocument('en', 'I forgot my password', 'problem.forgot_password');
// manager.addDocument('en', 'my internet is not working', 'problem.internet_issue');
// manager.addDocument('en', 'I cannot print', 'problem.printer_issue');
// manager.addDocument('en', 'my email is not syncing', 'problem.email_sync_issue');

// // Add more responses for the additional documents
// manager.addAnswer('en', 'problem.forgot_password', 'You can reset your password through the "Forgot Password" link on the login page.');
// manager.addAnswer('en', 'problem.internet_issue', 'Try restarting your router or contacting your internet service provider for assistance.');
// manager.addAnswer('en', 'problem.printer_issue', 'Make sure the printer is turned on and connected. Check for paper jams and restart the printer.');
// manager.addAnswer('en', 'problem.email_sync_issue', 'Check your internet connection and email settings. You may need to update your email password.');


// // Add documents for handling the user's query about the monitor not working
// manager.addDocument('en', 'my monitor is not working', 'problem.monitor');

// // Add responses for handling the user's query about the monitor and the user's responses
// manager.addDocument('en', 'yes', 'problem.monitor.yes');
// manager.addDocument('en', 'no', 'problem.monitor.no');

// // Add responses for the user's "yes" or "no" response regarding the monitor issue
// manager.addAnswer('en', 'problem.monitor', 'Did you check if the monitor is plugged in? Please respond with "yes" or "no".');
// manager.addAnswer('en', 'problem.monitor.yes', 'Great! If the monitor is plugged in and still not working, there might be other issues.');
// manager.addAnswer('en', 'problem.monitor.no', 'Please check if the monitor is plugged in properly and try again.');



