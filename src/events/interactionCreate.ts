import { ButtonInteraction, CommandInteraction } from "discord.js";

module.exports = {
    name: 'interactionCreate',
    async execute(interaction: CommandInteraction | ButtonInteraction) {

        if (interaction.isChatInputCommand()) {

            //@ts-ignore
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;
        
            if (command !== null) {
                try {
                    await command.execute(interaction);
                } catch (err) {
                    console.error(err);
                    await interaction.reply({ content: 'There was an error while attempting this command. Please try again.', ephemeral: true });
                }
            }
        }
        
        if (interaction.isAutocomplete()) {

            //@ts-ignore
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

            if (command !== null) {
                try {
                    await command.autocomplete(interaction);
                } catch (err) {
                    console.error(err);
                }
            }
        }

        if (interaction.isButton()) {

            const onButtonInteraction = (modulePath: string, interaction: ButtonInteraction) => {
                const module = require(modulePath);
                module.onButtonInteraction(interaction);
            }

            switch (interaction.customId) {
                case 'previous':
                case 'next':
                    onButtonInteraction('../commands/showtasks', interaction);
                    break;
            }
        }
    }
}