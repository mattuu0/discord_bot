import { Client, Events, GatewayIntentBits } from 'discord.js';
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

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const command = commands[interaction.commandName];

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        })
    }
});

client.login(config.token);
