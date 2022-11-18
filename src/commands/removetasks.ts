import { ApplicationCommand, CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder } from "discord.js";
import functions from "../functions";
import taskSchema from "../schemas/task-schema";

module.exports = {
    commandData: new SlashCommandBuilder()
    .setName('removetasks')
    .setDescription('Removes tasks from the database.')
    .addSubcommand(subcommand => subcommand
        .setName('one')
        .setDescription('Removes 1 task.')
        .addIntegerOption(option => option.setName('taskindex')
            .setDescription('The index of the task to be removed')
            .setMinValue(1)
            .setRequired(true)))
    .addSubcommand(subcommand => subcommand
        .setName('all')
        .setDescription('Removes all tasks.')),

    async execute(interaction: CommandInteraction){

        const tasks = await functions.getTasks(interaction);
        if (tasks.length == 0) return interaction.reply({content: "No tasks to delete!", ephemeral: true});

        // @ts-ignore
        if (interaction.options.getSubcommand() === 'one') {
            const taskIndex = interaction.options.get('taskindex')?.value as number;
            const taskName = tasks[taskIndex - 1].taskname;
            taskSchema.deleteOne({ _id: tasks[taskIndex - 1]._id }, (err: any) => { if (err) console.log(err) });
            await interaction.reply({content: `Task ${taskName} removed.`, ephemeral: true});
        }
        // @ts-ignore
        if (interaction.options.getSubcommand() === 'all') {
            taskSchema.deleteMany({ userID: interaction.user.id }, (err: any) => { if (err) console.error(err) });
            await interaction.reply({content: "All tasks succesfully cleared.", ephemeral: true});
        }
    }
}