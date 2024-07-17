import { CommandInteraction, SlashCommandBuilder,ButtonBuilder, ButtonStyle, ActionRowBuilder, TextChannel } from "discord.js";
import fs from 'fs'

let files:string[] = [];

const CommandID : string = 'mofusand';
const Command : string = "mofu";

function GetCustomID(customid : string) {
	return btoa(JSON.stringify({
		"customid" : customid,
		"CommandID" : CommandID
	}))
}

module.exports = {
	CID : CommandID,

	data: new SlashCommandBuilder()
		.setName(Command)
		.setDescription('show mofusand image!'),

	Init() {
		//ファイル一覧を取得
		files = fs.readdirSync('./もふもふモフサンド');
	},

 	async execute(interaction: CommandInteraction) {
		//ボタン
		const mofu_button = new ButtonBuilder()
			.setCustomId(GetCustomID('mofusand_button'))
			.setLabel('もふる')
			.setStyle(ButtonStyle.Primary);

		//ActionRow
		const row = new ActionRowBuilder()
			.addComponents(mofu_button) as ActionRowBuilder<ButtonBuilder>;

		await interaction.reply({
			components: [row]
		});
	},

	async Interection(interaction: any) {
		//ランダムなファイルを取得
		let filename = files[Math.floor(Math.random() * files.length)];

		//送信
		await interaction.reply({
			files: [`./もふもふモフサンド/${filename}`]
		});
	}
};
