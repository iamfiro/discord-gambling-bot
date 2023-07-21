import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, codeBlock, userMention } from "discord.js";
import { numberWithCommas } from "../../lib/format";
import { transferMoney } from "../../db/money";
import { onlyNumberRegex } from "../../lib/regex";
import { RegisterEmbed, TransferRegisterEmbed, checkAvailableUser, checkTransferUser } from "../../db/users";

async function handler(interaction: ChatInputCommandInteraction) {
    if(!onlyNumberRegex.test(interaction.options.get('금액').value.toString())) {
        const AmountMinimumErrorEmbed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle(`🚫 송금중 오류가 발생했습니다`)
        .setDescription('금액 입력이 올바르지 않습니다 금액은 숫자만 넣어주세요')
        .setTimestamp(Date.now())
        return await interaction.reply({ embeds: [AmountMinimumErrorEmbed], ephemeral: true})
    }
    if(Number(interaction.options.get('금액').value) < 1000) {
        const AmountMinimumErrorEmbed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle(`🚫 송금중 오류가 발생했습니다`)
        .setDescription('송금은 1000원부터 가능합니다')
        .setTimestamp(Date.now())
        return await interaction.reply({ embeds: [AmountMinimumErrorEmbed], ephemeral: true})
    }
    checkAvailableUser(interaction).then(async function(result) {
        if(result) return await interaction.reply({ embeds: [RegisterEmbed]});
        checkTransferUser(interaction.options.get('유저').value.toString()).then(async function(result) {
            if(result) return await interaction.reply({ embeds: [TransferRegisterEmbed], ephemeral: true});
            transferMoney(
                interaction,
                interaction.options.get('유저').value.toString(), 
                Number(interaction.options.get('금액').value),
            ).then(async function(result) {
                switch(result.status) {
                    case 'LOWER_THAN_SEND_AMOUNT':
                        const AmountErrorEmbed = new EmbedBuilder()
                        .setColor(0xED4245)
                        .setTitle(`🚫 송금중 오류가 발생했습니다`)
                        .setDescription('송금을 하기 위한 잔액이 부족합니다')
                        .setTimestamp(Date.now())
                        .addFields(
                            { name: '잔액', value: codeBlock('diff',`${numberWithCommas(Number(result.amount))}원`) },
                            { name: '송금 금액', value: codeBlock('diff',`${numberWithCommas(Number(interaction.options.get('금액').value))}원`) },
                        )
                        await interaction.reply({ embeds: [AmountErrorEmbed], ephemeral: true})
                        break;
                    case 'SUCCESSFULL':
                        const Embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle(`💸 송금이 완료되었습니다!`)
                        .setTimestamp(Date.now())
                        .addFields(
                            { name: '송금금액', value: codeBlock('diff',`${numberWithCommas(Number(interaction.options.get('금액').value))}원`) },
                            { name: '잔액', value: codeBlock('diff',`${numberWithCommas(Number(result.amount))}원`) },
                            { name: 'ㅤ', value: `${userMention(interaction.member.user.id)} -> ${userMention(interaction.options.get('유저').value.toString())}` },
                        )
                        await interaction.reply({ embeds: [Embed]})
                }
            })
        });
    });
}

export default {
    handler,
    info: new SlashCommandBuilder()
        .setName("송금")
        .setDescription("💸 다른 유저한테 송금할수 있어요")
        .addStringOption(option =>
            option.setName('금액')
            .setDescription('💸 금액을 입력해주세요. (1000원 이상)')
            .setNameLocalizations({
                ko: '금액'
            })
            .setDescriptionLocalizations({
                ko: '💸 금액을 입력해주세요.'
            })
            .setRequired(true)
        )
        .addUserOption(options =>
            options.setName('유저')
            .setDescription('👤 송금할 유저를 선택해주세요')
            .setDescriptionLocalizations({
                ko: '👤 레벨링을 관리할 멤버를 선택하세요.'
            })
            .setRequired(true)
        )
}