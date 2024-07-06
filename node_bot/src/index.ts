import { Client, Events, GatewayIntentBits ,Interaction, CacheType} from 'discord.js';
import fs from 'fs'

// config.jsonの内容が増えたときのことも考えて全部インポートしている
import * as config from './config.json';

const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands: any = {}
const commandFiles = fs.readdirSync('./build/commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands[command.data.name] = command
}

client.once("ready", async () => {
    const data = []
    for (const commandName in commands) {
        data.push(commands[commandName].data)
    }

    await client.application?.commands.set(data, config.serverid);
    console.log("Ready!");
});

//コマンドに対する応答
async function Command_Interaction(interaction : any) {
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

//モーダルの応答
async function SubmitModal(interaction:any) {
    console.log(interaction.customId);
}

client.on(Events.InteractionCreate, async (interaction) => {
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
