import { CommandInteraction, ButtonInteraction } from "discord.js";
import taskSchema from "./schemas/task-schema";

const functions = {
    async getTasks(interaction: CommandInteraction | ButtonInteraction){
        return taskSchema.find({ userID: interaction.user.id });
    }
}

export default functions;