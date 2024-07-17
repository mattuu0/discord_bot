import { Client, Events, GatewayIntentBits, ButtonStyle, ActionRowBuilder, ButtonBuilder, TextChannel } from 'discord.js';
import fs from 'fs'

// config.jsonの内容が増えたときのことも考えて全部インポートしている
import * as config from './config.json';

const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands: any = {};
const command_datas : any = {};
const commandFiles = fs.readdirSync('./build/commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    try {    //コマンド初期化
        command.Init();
    } catch (error) {
        console.error(error);
    }

    //コマンドID設定
    if (command.CID != undefined) {
        command_datas[command.CID] = command;
    }

    //コマンド情報設定
    commands[command.data.name] = command;
}

client.once("ready", async () => {
    const data = []
    for (const commandName in commands) {
        //コマンド登録
        data.push(commands[commandName].data)
    }

    await client.application?.commands.set(data, config.serverid);
    console.log("Ready!");
});

//コマンドに対する応答
async function Command_Interaction(interaction: any) {
    //コマンドを取得
    const command = commands[interaction.commandName];

    try {
        //コマンドを実行
        await command.execute(interaction);
    } catch (error) {
        //エラー処理
        console.error(error);
        await interaction.reply({
            content: 'コマンドの実行に失敗しました',
            ephemeral: true,
        })
    }
}

//ボタンに対する応答
async function Button_Interaction(interaction: any) {
    //ボタンを取得
    const buttonid = interaction.customId;
    const parse_data = JSON.parse(atob(buttonid));

    //コマンド取得
    const command = command_datas[parse_data["CommandID"]];

    try {
        //コマンドを実行
        await command.Interection(interaction);
    } catch (error) {
        //エラー処理
        console.error(error);
        await interaction.reply({
            content: 'エラーだよ',
            ephemeral: true,
        })
    }
}

//モーダルの応答
async function SubmitModal(interaction: any) {
    console.log(interaction.customId);
}

client.on(Events.InteractionCreate, async (interaction: any) => {
    console.log(interaction);

    //ボタンかどうか
    if (interaction.isButton()) {
        //ボタンを実行
        await Button_Interaction(interaction);
        return;
    }

    //コマンドかどうか判定
    if (interaction.isCommand()) {
        //コマンドを実行
        await Command_Interaction(interaction);
        return;
    }

    //インタラクションの場合
    if (interaction.isModalSubmit()) {
        //コマンドを実行
        await SubmitModal(interaction);
        return;
    }

});

client.login(config.token);
