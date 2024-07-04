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

console.log(commands);

client.once("ready", async () => {
    const data = []
    for (const commandName in commands) {
        data.push(commands[commandName].data)
    }

    console.log(await client.application?.commands.set(data, config.serverid));
    console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const command = commands[interaction.commandName];

    console.log(commands);

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
