"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
// config.jsonの内容が増えたときのことも考えて全部インポートしている
const config = __importStar(require("./config.json"));
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
const commands = {};
const command_datas = {};
const commandFiles = fs_1.default.readdirSync('./build/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    try { //コマンド初期化
        command.Init();
    }
    catch (error) {
        console.error(error);
    }
    //コマンドID設定
    if (command.CID != undefined) {
        command_datas[command.CID] = command;
    }
    //コマンド情報設定
    commands[command.data.name] = command;
}
client.once("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = [];
    for (const commandName in commands) {
        //コマンド登録
        data.push(commands[commandName].data);
    }
    yield ((_a = client.application) === null || _a === void 0 ? void 0 : _a.commands.set(data, config.serverid));
    console.log("Ready!");
}));
//コマンドに対する応答
function Command_Interaction(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        //コマンドを取得
        const command = commands[interaction.commandName];
        try {
            //コマンドを実行
            yield command.execute(interaction);
        }
        catch (error) {
            //エラー処理
            console.error(error);
            yield interaction.reply({
                content: 'コマンドの実行に失敗しました',
                ephemeral: true,
            });
        }
    });
}
//ボタンに対する応答
function Button_Interaction(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        //ボタンを取得
        const buttonid = interaction.customId;
        const parse_data = JSON.parse(atob(buttonid));
        //コマンド取得
        const command = command_datas[parse_data["CommandID"]];
        try {
            //コマンドを実行
            yield command.Interection(interaction);
        }
        catch (error) {
            //エラー処理
            console.error(error);
            yield interaction.reply({
                content: 'エラーだよ',
                ephemeral: true,
            });
        }
    });
}
//モーダルの応答
function SubmitModal(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(interaction.customId);
    });
}
client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(interaction);
    //ボタンかどうか
    if (interaction.isButton()) {
        //ボタンを実行
        yield Button_Interaction(interaction);
        return;
    }
    //コマンドかどうか判定
    if (interaction.isCommand()) {
        //コマンドを実行
        yield Command_Interaction(interaction);
        return;
    }
    //インタラクションの場合
    if (interaction.isModalSubmit()) {
        //コマンドを実行
        yield SubmitModal(interaction);
        return;
    }
}));
client.login(config.token);
//# sourceMappingURL=index.js.map