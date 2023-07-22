import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, codeBlock, userMention } from "discord.js";
import { numberWithCommas } from "../../lib/format";
import { transferMoney } from "../../db/money";
import { onlyNumberRegex } from "../../lib/regex";
import { RegisterEmbed, TransferRegisterEmbed, checkAvailableUser, checkTransferUser } from "../../db/users";

async function handler(interaction: ChatInputCommandInteraction) {
    if(!onlyNumberRegex.test(interaction.options.get('금액').value.toString())) {
        const AmountMinimumErrorEmbed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle(`🚫 몰빵베팅중 오류가 발생했습니다`)
        .setDescription('금액 입력이 올바르지 않습니다 금액은 숫자만 넣어주세요')
        .setTimestamp(Date.now())
        return await interaction.reply({ embeds: [AmountMinimumErrorEmbed], ephemeral: true})
    }
    if(Number(interaction.options.get('금액').value) < 1000) {
        const AmountMinimumErrorEmbed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle(`🚫 몰빵베팅중 오류가 발생했습니다`)
        .setDescription('몰빵베팅은 1000원부터 가능합니다')
        .setTimestamp(Date.now())
        return await interaction.reply({ embeds: [AmountMinimumErrorEmbed], ephemeral: true})
    }
    checkAvailableUser(interaction).then(async function(result) {
        if(result) return await interaction.reply({ embeds: [RegisterEmbed]});
        checkTransferUser(interaction.options.get('유저').value.toString()).then(async function(result) {
            if(result) return await interaction.reply({ embeds: [TransferRegisterEmbed], ephemeral: true});

        });
    });
}

export default {
    handler,
    info: new SlashCommandBuilder()
        .setName("몰빵베팅")
        .setDescription("💸 돈을 걸고 한 사람에게 몰빵할수 있어요")
        .addStringOption(option =>
            option.setName('베팅금액')
            .setDescription('💸 베팅금액을 입력해주세요. (1000원 이상)')
            .setRequired(true)
        )
        .addUserOption(options =>
            options.setName('대결유저')
            .setDescription('👤 송대결할 유저를 선택해주세요')
            .setRequired(true)
        )
}