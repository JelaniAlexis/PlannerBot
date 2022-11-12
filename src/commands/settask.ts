import { SlashCommandBuilder, CommandInteraction, CommandInteractionOption, CacheType } from 'discord.js';
import taskSchema from '../schemas/task-schema';

module.exports = {
    choices: [
        'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:30', 'UTC-09:00', 'UTC-08:00',
        'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00',
        'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+03:30',
        'UTC+04:00', 'UTC+04:30', 'UTC+05:00', 'UTC+05:30', 'UTC+05:45', 'UTC+06:00',
        'UTC+06:30', 'UTC+07:00', 'UTC+08:00', 'UTC+08:45', 'UTC+09:00', 'UTC+09:30',
        'UTC+10:00', 'UTC+10:30', 'UTC+11:00', 'UTC+12:00', 'UTC+12:45', 'UTC+13:00', 'UTC+14:00'
    ],
    commandData: new SlashCommandBuilder()
        .setName('settask')
        .setDescription('Sets a deadline for a task.')
        .addStringOption(option => option.setName('taskname')
            .setDescription('The name of the task.')
            .setRequired(true))
        .addStringOption(option => option.setName('expirationdate')
            .setDescription("The date which you want the task to expire on. Format: YYYY-MM-DD")
            .setRequired(true))
        .addStringOption(option => option.setName('expirationtime')
            .setDescription("The exact time you want the task to expire at. Format: HH:MM:SS")
            .setRequired(true))
        .addStringOption(option => option.setName('timezone')
            .setDescription("The timezone to take into account.")
            .setRequired(true)
            .setAutocomplete(true)),
    
    async autocomplete(interaction: any) {
        const focusedValue = interaction.options.getFocused();
        const filtered: Array<string> = this.choices.filter((choice: string) => choice.startsWith(focusedValue));

        const options: Array<string> = filtered.length > 25 ? filtered.slice(0, 25) : filtered;

        await interaction.respond(
            options.map(choice => ({ name: choice, value: choice.slice(3) })),
        );
    },

    async execute(interaction: CommandInteraction) {
        const taskName: CommandInteractionOption<CacheType> | null = interaction.options.get('taskname') !== null ? interaction.options.get('taskname') : null;
        const expirationDate: CommandInteractionOption<CacheType> | null = interaction.options.get('expirationdate') !== null ? interaction.options.get('expirationdate') : null;
        const expirationTime: CommandInteractionOption<CacheType> | null = interaction.options.get('expirationtime') !== null ? interaction.options.get('expirationtime') : null;
        const timeZone: CommandInteractionOption<CacheType> | null = interaction.options.get('timezone') !== null ? interaction.options.get('timezone') : null;

        const taskExpiration: string = `${expirationDate?.value}T${expirationTime?.value || '00:00:00'}${timeZone?.value}`;
        
        await new taskSchema({
            taskname: taskName?.value,
            expirationDate: taskExpiration,
            userID: interaction.user.id
        }).save()
        await interaction.reply({ content: `Task ${taskName?.value} added.`, ephemeral: true });
    }
}