const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('Connected to DB');
        })

        connection.on('error', (err) => {
            console.log('ERROR: ', err);
        })
    }
    catch (err) {
        console.log(`ERROR: ${err}`);
    }
}

module.exports = connectDB