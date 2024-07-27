import { CommandInteraction, SlashCommandBuilder,ButtonBuilder, ButtonStyle, ActionRowBuilder, TextChannel, Client, ButtonInteraction } from "discord.js";
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
	//コマンドID
	CID : CommandID,

	//コマンドのデータ
	data: new SlashCommandBuilder()
		.setName(Command)
		.setDescription('show mofusand image!'),

	//コマンド初期化
	Init() {
		//ファイル一覧を取得
		files = fs.readdirSync('./mofumofu');
	},

	//コマンドが実行されてたとき
 	async execute(interaction: CommandInteraction,client: Client) {
		//ボタン
		const mofu_button = new ButtonBuilder()
			.setCustomId(GetCustomID('mofusand_button'))
			.setLabel('もふる')
			.setStyle(ButtonStyle.Primary);

		//ActionRow
		const row = new ActionRowBuilder()
			.addComponents(mofu_button) as ActionRowBuilder<ButtonBuilder>;

		const user = client.users.cache.get('ID')
		await interaction.reply({
			components: [row]
		});
	},

	//ボタンとかが押されたとき
	async Interection(interaction: ButtonInteraction,client: Client) {
		//ランダムなファイルを取得
		let filename = files[Math.floor(Math.random() * files.length)];

		const mofu_button = new ButtonBuilder()
			.setCustomId(GetCustomID('mofusand_button'))
			.setLabel('もふる')
			.setStyle(ButtonStyle.Primary);

		//ActionRow
		const row = new ActionRowBuilder()
			.addComponents(mofu_button) as ActionRowBuilder<ButtonBuilder>;

		
		//送信
		// await interaction.reply({
		// 	content:"wao",
		// 	ephemeral : true,
		// });
		await interaction.reply({
			content : "もふっています",
			ephemeral: true
		});

		//コチャ送信
		await interaction.user.send({
			files: [`./mofumofu/${filename}`],
			components: [row]
		})

		await interaction.deleteReply();
	}
};
