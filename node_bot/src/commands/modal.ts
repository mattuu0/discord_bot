import { CommandInteraction, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalActionRowComponentBuilder } from "discord.js";


module.exports = {
	data: new SlashCommandBuilder()
		.setName('modal')
		.setDescription('show modal dialog!'),

 	async execute(interaction: CommandInteraction) {
		const question = new TextInputBuilder()
			.setCustomId(`question`)
			.setLabel(`好きな色を教えてね`)
			.setStyle(TextInputStyle.Short);
		
		const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
			.addComponents(question);
		const modal = new ModalBuilder()
			.setCustomId('modal1')
			.setTitle('モーダルの例です');

		modal.addComponents(actionRow);
		await interaction.showModal(modal);
	},
};
