import { type User } from "@prisma/client"
import prisma from "../lib/prisma"
import { TransferRegisterEmbed, checkTransferUser, getUserData } from "./users";
import { ChatInputCommandInteraction, Interaction } from "discord.js";

export const getUserMoney = async (interaction: ChatInputCommandInteraction): Promise<number> => {
    const exists = await prisma.user.findFirst({ where: { name: interaction.member.user.id } })
    return exists.money;
}

export const betMoney = async (interaction: ChatInputCommandInteraction, scale: number, money: number): Promise<{ amount: number, accountAmount }> => {
    return getUserMoney(interaction).then(async function(result) {
        return await prisma.user.update({
            where: {
                name: interaction.member.user.id.toString()
            },
            data: {
                betWin: {
                    increment: scale !== 0 ? 1: 0
                },
                betFailed: {
                    increment: scale === 0 ? 1: 0
                },
                money: scale === 0 ? result - (money) : (result - money) + (money * scale)
            }
        }).then(async (response) => {
            console.log(response)
            return {amount: (money * scale), accountAmount: response.money}
        })
    })
}

export const transferMoney = async (interaction: ChatInputCommandInteraction, toUser: string, amount: number): Promise<{ status: string; amount: number; }> => {
    checkTransferUser(toUser).then(async function(result) {
        if(result) return await interaction.reply({ embeds: [TransferRegisterEmbed], ephemeral: true})
    });
    const transfer = getUserData(interaction).then(async function(result) {
        if (result.money as number < amount) return { status: 'LOWER_THAN_SEND_AMOUNT', amount: result.money}; 
        const decreaseUserMoney = await prisma.user.update({ where: { name: interaction.member.user.id }, data: { money: result.money - amount}});
        const increaseToUserMoney = await prisma.user.update({ where: { name: toUser }, data: { money: result.money + amount}})  
        return { status: 'SUCCESSFULL', amount: decreaseUserMoney.money}
    });

    return transfer
}

export const increaseUserMoney = async (name: string, moneyValue): Promise<number> => {
    let money = 0;
    await prisma.user.findFirst({
        where: {
            name,
        }
    }).then(async (user) => {
        const UpdateUserMoney = await prisma.user.update({
            where: {
                name: user.name
            },
            data: {
                money: user.money + moneyValue,
            }
        }).then(async (createUser) => {
            money = createUser.money
        })
    });
    return money
}