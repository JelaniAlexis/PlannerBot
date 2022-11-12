import { REST, Routes } from 'discord.js';
require('dotenv').config();

let token: string;
if (typeof process.env.TOKEN === 'string') token = process.env.TOKEN;
else token = "";

let clientId: string;
if (typeof process.env.CLIENT_ID === 'string') clientId = process.env.CLIENT_ID;
else clientId = "";

const rest = new REST({ version: '10' }).setToken(token);
const args = process.argv.slice(2);

require('dotenv').config();

// Whether to delete one command or all of them
const deletionScope = args[0];

if (deletionScope == "all") {

	// ts-node ./src/delete-commands all guild [guildId]
	if (args[1] == "guild" && args[2]) {
		rest.put(Routes.applicationGuildCommands(clientId, args[2]), { body: [] })
			.then(() => console.log('Successfully deleted all guild commands.'))
			.catch(console.error);
	}

	// ts-node ./src/delete-commands all global
	else if (args[1] == "global") {
		rest.put(Routes.applicationCommands(clientId), { body: [] })
			.then(() => console.log('Successfully deleted all application commands.'))
			.catch(console.error);
	}

	else {
		console.log("Missing arguments, please refer to the documentation.");
	}

}

else if (deletionScope == "one") {

	// ts-node ./src/delete-commands one [commandId] guild [guildId]
	if (args[2] == "guild" && args[3]) {
		rest.delete(Routes.applicationGuildCommand(clientId, args[3], args[1]))
		.then(() => console.log('Successfully deleted guild command.'))
		.catch(console.error);
	}

	// ts-node ./src/delete-commands one [commandId] global
	else if (args[2] == "global") {
		rest.delete(Routes.applicationCommand(clientId, args[1]))
			.then(() => console.log('Successfully deleted application command.'))
			.catch(console.error);
	}

	else {
		console.log("Invalid command scope.");
	}
}

else {
	console.log("Invalid deletion scope.");
}