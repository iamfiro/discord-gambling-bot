import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { RegisterEmbed, checkAvailableUser, registerUserData } from "../../db/users";

const Embed = new EmbedBuilder()
    .setTitle("🤔 Exper 네트워크에 소속되어 있습니다")

async function handler(interaction: ChatInputCommandInteraction) {
    checkAvailableUser(interaction).then(async function(result) {
        if(!result) return await interaction.reply({ embeds: [Embed]});
        registerUserData(interaction).then(async function(result) {
            const Embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle("✅ 가입해주셔서 감사합니다")
            await interaction.reply({ embeds: [Embed]})
        });
    });
}

export default {
    info: new SlashCommandBuilder().setName("가입").setDescription("🔓 Exper 네트워크에 가입"),
    handler
}