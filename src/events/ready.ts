import mongoose from 'mongoose';
import { Client } from 'discord.js';
require('dotenv').config();

module.exports = {
    name: 'ready',
    once: true,
    execute(client: Client) {
        process.stdout.write("Opening connection to MongoDB...")
        mongoose.connect(process.env.MONGODB_URI || '', {
            keepAlive: true,
        })
        .then(() => {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write("MongoDB connection established.\n");

            //@ts-ignore
            const currentTime = (Date.now() - client.loadingStartTime) / 1000;
            //@ts-ignore
            console.log(`Logged in as ${client.user?.tag} (Total loading time: ${currentTime.toFixed(2)}s)`);
        })
        .catch(err => {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(`Error occured while trying to connect:\n${err}\n`);
            process.exit;
        });
    },
};