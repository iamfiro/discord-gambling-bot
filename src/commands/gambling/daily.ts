import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { RegisterEmbed, checkAvailableUser, getLastDailyData, setLastDailyData } from "../../db/users";

async function handler(interaction: ChatInputCommandInteraction) {
    checkAvailableUser(interaction).then(async function(result) {
        if(result) return await interaction.reply({ embeds: [RegisterEmbed]});
        getLastDailyData(interaction).then(async function(result) {
            const date = new Date()
            const lastDailyDate = result.toString()
            const currentDate = (date.getFullYear()+ '-' + (date.getMonth() + 1) + '-' + date.getDate()).toString()
            if(lastDailyDate === currentDate) {
                const Embed = new EmbedBuilder()
                    .setColor(0xED4245)
                    .setTitle(`이미 오늘 받으셨습니다`)
                    .setTimestamp(Date.now())
                return await interaction.reply({ embeds: [Embed]});
            }
            setLastDailyData(interaction).then(async function(result) {
                const Embed = new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle(`✅ 출석 체크 완료`)
                .setDescription("보상으로 20,000원이 입금되었습니다.")
                .setTimestamp(Date.now())
                await interaction.reply({ embeds: [Embed]})    
            })
        })
    });
}

export default {
    info: new SlashCommandBuilder().setName("출첵").setDescription("😀 매일 아침 출첵으로 시작하는 삶"),
    handler
}