import { client, rest } from './lib/bot';
import ping from './commands/ping';
import getMoney from './commands/gambling/getUserInfo';
import randomMoney from './commands/gambling/randomMoney';
import transferMoney from './commands/gambling/transferMoney';
import register from './commands/gambling/register';
import { Routes } from 'discord.js';
import gambling from './commands/gambling/gambling';

client.on('ready', async() => {
    await rest.put(Routes.applicationCommands(process.env.BOT_ID), {
        body: [
            ping.info.toJSON(), 
            getMoney.info.toJSON(),
            randomMoney.info.toJSON(),
            transferMoney.info.toJSON(),
            register.info.toJSON(),
            gambling.info.toJSON()
        ]
    })
    console.log(`✅ Logged in as ${client.user?.tag}!`)
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        switch (interaction.commandName) {
            case 'ping': ping.handler(interaction); break;
            case '정보': getMoney.handler(interaction); break;
            case '돈받기': randomMoney.handler(interaction); break;
            case '송금': transferMoney.handler(interaction); break;
            case '가입': register.handler(interaction); break;
            case '도박': gambling.handler(interaction); break;
        }
    } else if (interaction.isButton()) {
        
    }
})

;(async () => {
    client.login(process.env.BOT_TOKEN)
})()