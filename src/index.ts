const loadingStartTime = Date.now();

// File System modules
import { readdirSync } from 'fs';
import { join } from 'path';

// Discord.js and dotenv modules
import { Client, Collection, GatewayIntentBits } from 'discord.js';
const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });
require('dotenv').config();

//@ts-ignore
client.loadingStartTime = loadingStartTime;
//@ts-ignore
client.commands = new Collection();
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));

for (const file of commandFiles) {
    process.stdout.write(`Loading command '${file.slice(0, -3)}'...`);
    const command = require(join(commandsPath, file));
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Command '${command.commandData.name}' loaded.\n`);
    //@ts-ignore
    client.commands.set(command.commandData.name, command);
}

const eventsPath = join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter((file: string) => file.endsWith('.ts'));

for (const file of eventFiles) {
    process.stdout.write(`Loading event '${file.slice(0, -3)}'...`);
    const event = require(join(eventsPath, file));
    if (event.once) {
        client.once(event.name, (...args: Array<string>) => event.execute(...args));
    } else {
        client.on(event.name, (...args: Array<string>) => event.execute(...args));
    }

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Event '${event.name}' loaded.\n`);
}

client.login(process.env.TOKEN);