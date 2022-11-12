import { readdirSync } from 'fs';
import { join } from 'path';

const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [];
const commandsPath: string = join(__dirname, 'commands');
const commandFiles: string[] = readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));
let token: string;
if (typeof process.env.TOKEN === 'string') token = process.env.TOKEN;
else token = "";

let clientId: string;
if (typeof process.env.CLIENT_ID === 'string') clientId = process.env.CLIENT_ID;
else clientId = "";

const rest = new REST({ version: '10' }).setToken(token);
const args = process.argv.slice(2);

for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

if (args[0] == "guild") {
    // ts-node ./src/deploy-commands guild [guildId]
    rest.put(Routes.applicationGuildCommands(clientId, args[1]), { body: commands })
    .then((data: any) => console.log(`${data.length} guild commands registered successfully.`))
    .catch(console.error);

} else if (args[0] == "global") {
    // ts-node ./src/deploy-commands global
    rest.put(Routes.applicationCommands(clientId), { body: commands })
    .then((data: any) => console.log(`${data.length} application commands registered successfully.`))
    .catch(console.error);
}