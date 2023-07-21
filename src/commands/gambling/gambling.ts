import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, codeBlock } from "discord.js";
import { RegisterEmbed, checkAvailableUser, getUserData } from "../../db/users";
import { numberWithCommas } from "../../lib/format";
import { onlyNumberRegex } from "../../lib/regex";
import { betMoney, getUserMoney } from "../../db/money";

function randomType(random: number) {
    if(random > 0 && random < 24) return 1.3;
    if(random > 24 && random < 41) return 2;
    if(random > 41 && random < 51) return 3;
    if(random > 51 && random < 54) return 5;
    if(random > 54 && random < 60) return 2.4;
    if(random > 60 && random < 64) return 3.1;
    return 0;
}

function randomMessage(scale: number) {
    switch(scale) {
        case 0: return '📉 아이고... 아쉬워요';
        case 1.3: return '📈 누군가가 말했어요, 티끌모아 태산이라고..';
        case 2: return '📈 두배둡두비부배따딴딴';
        case 2.4: return '📈 2.4% 뭐 평범하네요ㅋ';
        case 3: return '📈 3배가 나오시다니.. 대단하세요!';
        case 3.1: return '📈 3.141592...';
        case 5: return '📈 ⭐⭐⭐⭐⭐ 별이 다섯개!';
    }
}

async function handler(interaction: ChatInputCommandInteraction) {
    checkAvailableUser(interaction).then(async function(verficationResult) {
        if(verficationResult) return await interaction.reply({ embeds: [RegisterEmbed]});
        getUserMoney(interaction).then(async function(result) {
            if(!onlyNumberRegex.test(interaction.options.get('베팅금액').value.toString())) {
                const AmountMinimumErrorEmbed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle(`🚫 베팅중 오류가 발생했습니다`)
                .setDescription('금액 입력이 올바르지 않습니다. 금액은 숫자만 넣어주세요')
                .setTimestamp(Date.now())
                return await interaction.reply({ embeds: [AmountMinimumErrorEmbed], ephemeral: true})
            }
            if(Number(interaction.options.get('베팅금액').value) < 1000) {
                const AmountMinimumErrorEmbed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle(`🚫 베팅중 오류가 발생했습니다`)
                .setDescription('베팅은 1000원부터 가능합니다')
                .setTimestamp(Date.now())
                return await interaction.reply({ embeds: [AmountMinimumErrorEmbed], ephemeral: true})
            }
            if(Number(interaction.options.get('베팅금액').value) > result) {
                const AmountMinimumErrorEmbed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle(`🚫 베팅중 오류가 발생했습니다`)
                .setDescription('베팅에 필요한 잔액이 부족합니다')
                .setTimestamp(Date.now())
                return await interaction.reply({ embeds: [AmountMinimumErrorEmbed], ephemeral: true})
            }
    
            let randomScale = randomType(Math.floor((Math.random()*(100-1))+1));
            betMoney(interaction, randomScale, Number(interaction.options.get('베팅금액').value)).then(async function(result) {
                const failEmbed = new EmbedBuilder()
                .setColor(randomScale === 0 ? 0x3498DB : 0xED4245)
                .setTitle(randomMessage(randomScale))
                .addFields({ name: '\u200B', value: '\u200B' },{ 
                    name: '배율 📊', 
                    value: randomScale.toString(), 
                    inline: true,
                }, { 
                    name: '베팅 금액 🧾', 
                    value: numberWithCommas(Number(interaction.options.get('베팅금액').value)).toString() + '원\n', 
                    inline: true,
                }, { 
                    name: '베팅 수익 💸', 
                    value: numberWithCommas(Math.floor(result.amount)).toString() + '원', 
                    inline: true,
                }, { 
                    name: '내 잔고 💰', 
                    value: numberWithCommas(result.accountAmount).toString() + '원', 
                    inline: true,
                })
                await interaction.reply({ embeds: [failEmbed]})  
            })  
        })
    });
}

export default {
    info: new SlashCommandBuilder()
        .setName("도박")
        .setDescription("😀 자신의 프로필을 확인합니다")
        .addStringOption(option =>
            option.setName('베팅금액')
            .setDescription('💸 베팅 금액을 입력해주세요. (1000원 이상)')
            .setNameLocalizations({
                ko: '베팅금액'
            })
            .setDescriptionLocalizations({
                ko: '💸 베팅 금액을 입력해주세요.'
            })
            .setRequired(true)
        ),
    handler
}