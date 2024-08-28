import { NlpManager } from 'node-nlp';

const manager = new NlpManager({ languages: ['en'] });

const addTrainingData = () => {
    // Welcoming training
    manager.addDocument('en', 'hi', 'greetings');
    manager.addDocument('en', 'hello', 'greetings');
    manager.addDocument('en', 'how are you', 'greetings');
    manager.addAnswer('en', 'greetings', 'Hello! How can I assist you today?');

    // Goodbye training
    manager.addDocument('en', 'bye', 'goodbye');
    manager.addDocument('en', 'goodbye', 'goodbye');
    manager.addDocument('en', 'see you later', 'goodbye');
    manager.addAnswer('en', 'goodbye', 'Goodbye! Have a great day!');

    // IT Issues training
    // Monitor issues
    manager.addDocument('en', 'My monitor is not working', 'monitor_issue');
    manager.addDocument('en', 'The screen is blank', 'monitor_issue');
    manager.addDocument('en', 'I can\'t see anything on my monitor', 'monitor_issue');
    manager.addAnswer('en', 'monitor_issue', 'If your monitor is not working, please check the power connection and ensure that the monitor is turned on. If the issue persists, try restarting your computer or check the cables.');

    // Printer issues
    manager.addDocument('en', 'My printer is not printing', 'printer_issue');
    manager.addDocument('en', 'The printer is giving an error', 'printer_issue');
    manager.addDocument('en', 'I can\'t print documents', 'printer_issue');
    manager.addAnswer('en', 'printer_issue', 'Ensure that the printer is properly connected and has paper. Check if there are any error messages on the printer display. Restart the printer and try printing again. If the problem continues, check the printer\'s drivers and settings.');

    // Network issues
    manager.addDocument('en', 'I can\'t connect to the internet', 'network_issue');
    manager.addDocument('en', 'My Wi-Fi is not working', 'network_issue');
    manager.addDocument('en', 'How do I fix network issues?', 'network_issue');
    manager.addAnswer('en', 'network_issue', 'Check if your router is plugged in and powered on. Make sure you are within the range of the Wi-Fi signal. Restart your router and your device. If the issue persists, contact your network provider or IT support.');

    // Software issues
    manager.addDocument('en', 'The software is crashing', 'software_issue');
    manager.addDocument('en', 'I have trouble with an application', 'software_issue');
    manager.addDocument('en', 'How do I update the software?', 'software_issue');
    manager.addAnswer('en', 'software_issue', 'Try restarting the application or your computer. Check for any available updates for the software and install them. If the issue continues, reinstall the software or contact support for further assistance.');

    // More training data
    manager.addDocument('en', 'I can\'t find my files', 'file_issue');
    manager.addDocument('en', 'My files are missing', 'file_issue');
    manager.addAnswer('en', 'file_issue', 'Ensure that you are searching in the correct directory. Check the recycle bin or trash. If the files were accidentally deleted, you might be able to recover them using file recovery software.');

    manager.addDocument('en', 'The application is freezing', 'software_issue');
    manager.addAnswer('en', 'software_issue', 'If an application is freezing, try restarting it or your computer. Ensure that you have enough system resources and check for any software updates. If the problem persists, consider reinstalling the application or contacting support.');
};

const trainAndSave = async () => {
    addTrainingData();
    await manager.train();
    await manager.save();
    console.log('NLP model trained and saved');
};

trainAndSave().catch(console.error);
