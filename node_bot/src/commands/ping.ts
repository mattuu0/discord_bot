import { CommandInteraction, SlashCommandBuilder } from "discord.js";


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),

	Init() {
		console.log('ping');
	},

 	async execute(interaction: CommandInteraction) {

		await interaction.reply('Pong!');
	},
};
