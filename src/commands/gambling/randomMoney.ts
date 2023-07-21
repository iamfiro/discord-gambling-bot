import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, codeBlock } from "discord.js";
import { RegisterEmbed, checkAvailableUser, getUserData } from "../../db/users";
import { getUserMoney, increaseUserMoney } from "../../db/money";
import { numberWithCommas } from "../../lib/format";

async function handler(interaction: ChatInputCommandInteraction) {
    checkAvailableUser(interaction).then(async function(result) {
        if(result) return await interaction.reply({ embeds: [RegisterEmbed]});
        let money = 0;
        let randomMoney = Math.floor((Math.random()*(5000-1000))+1000);
        const data = await getUserData(interaction)
        money = data.money;
        increaseUserMoney(interaction.member.user.id, randomMoney).then(async function(result) {
            const Embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`💸 송금 해드렸어요!`)
            .setTimestamp(Date.now())
            .addFields(
                { name: '송금된 금액', value: `\`\`\`${numberWithCommas(randomMoney)}원\`\`\`` },
                { name: '잔액', value: `\`\`\`${numberWithCommas(result)}원\`\`\`` },
            )
            await interaction.reply({ embeds: [Embed]})
        });
    })
}

export default {
    info: new SlashCommandBuilder().setName("돈받기").setDescription("📦 돈이 부족할때 저를 찾아와요"),
    handler
}