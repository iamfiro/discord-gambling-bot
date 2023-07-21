import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, codeBlock } from "discord.js";
import { RegisterEmbed, checkAvailableUser, getUserData } from "../../db/users";
import { numberWithCommas } from "../../lib/format";

async function handler(interaction: ChatInputCommandInteraction) {
    checkAvailableUser(interaction).then(async function(result) {
        if(result) return await interaction.reply({ embeds: [RegisterEmbed]});
        const data = await getUserData(interaction)
        const Embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${interaction.member.user.username} 님의 정보 🧐`)
        .setTimestamp(Date.now())
        .addFields(
            { name: '잔액', value: `\`\`\`${numberWithCommas(Number(data.money))}원\`\`\`` },
            { name: '베팅 성공', value: codeBlock('diff', `+${numberWithCommas(data.betWin || 0)}번`), inline: true },
            { name: '베팅 실패', value: codeBlock('diff', `-${numberWithCommas(data.betFailed || 0)}번`), inline: true },
        )
        await interaction.reply({ embeds: [Embed]})
    });
}

export default {
    info: new SlashCommandBuilder().setName("정보").setDescription("😀 자신의 프로필을 확인합니다"),
    handler
}