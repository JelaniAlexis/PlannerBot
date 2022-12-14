import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } from 'discord.js';
import functions from '../functions';

module.exports = {
    commandData: new SlashCommandBuilder()
        .setName('showtasks')
        .setDescription('Shows all tasks you have saved.'),
    
    async updateStats(tasks: Array<any>, embed: EmbedBuilder, page: number = 1) {

        const displayedTasks: Array<any> = tasks.slice((page - 1) * 10, page * 10);

        displayedTasks.forEach((task, index) => {
            let dateString: any = task.expirationDate.getTime() / 1000;
            embed.addFields({ name: `${(page - 1) * 10 + 1 + index}: ${task.taskname}`, value: `Deadline: <t:${dateString}>` });
        });

        if (displayedTasks.length > 0) {
            embed
                .setFooter({ text: `Showing ${(page - 1) * 10 + 1}-${page * 10 > tasks.length ? tasks.length : page * 10} of ${tasks.length}` })
                .setDescription(`**Page ${page}/${Math.ceil(tasks.length / 10)}**`);
        } else {
            embed.setDescription("Whoops! Looks like you have no tasks set.");
        }
    },

    async execute(interaction: CommandInteraction) {

        const embed = new EmbedBuilder()
        .setColor(0xE8C773)
        .setTitle("Your Tasks");

        const actionRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('⏪ Prev')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next ⏩')
                .setStyle(ButtonStyle.Primary),
        );

        const tasks = await functions.getTasks(interaction);
        await this.updateStats(tasks, embed);

        await interaction.reply({
            embeds: [embed],
            components: [actionRow],
        });
    },

    async onButtonInteraction(interaction: ButtonInteraction) {

        const tasks = await functions.getTasks(interaction);
        const interactionEmbed = interaction.message.embeds[0];
        const embed = EmbedBuilder.from(interactionEmbed)
            .setFields()
            .setDescription(interactionEmbed.description);
        
        const pageCount = Math.ceil(tasks.length / 10);
        const page = parseInt(interactionEmbed.description?.slice(7, -(pageCount.toString().length + 3)) as string);

        if (interaction.customId == "previous") {
            if (page - 1 > 0) await this.updateStats(tasks, embed, page - 1)
            else await this.updateStats(tasks, embed, page);
            interaction.update({
                embeds: [embed],
                components: [interaction.message.components[0]],
            })
        }
        else if (interaction.customId == "next") {
            if (page < pageCount) await this.updateStats(tasks, embed, page + 1)
            else await this.updateStats(tasks, embed, page);
            interaction.update({
                embeds: [embed],
                components: [interaction.message.components[0]],
            })
        }
        
    }
}