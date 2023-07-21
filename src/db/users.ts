import { type User } from "@prisma/client"
import prisma from "../lib/prisma"
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js"
import { dailyMoney } from "./money"

export const RegisterEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`처음 보는 분이시네요?`)
    .setDescription(`\`/가입\`을 입력해 Exper 네트워크에 가입하세요!`)

export const TransferRegisterEmbed = new EmbedBuilder()
    .setColor(0xED4245)
    .setTitle(`🚫 가입되지 않은 사용자 입니다`)
    .setDescription(`상대방이 Exper 네트워크에 가입 되어있지 않아요`)

export const checkAvailableUser = async (interaction: ChatInputCommandInteraction): Promise<boolean> => {
    const exists = await prisma.user.findFirst({ where: { name: interaction.member.user.id } });
    if (exists) return false;
    return true
}

export const checkTransferUser = async (userid: string): Promise<boolean> => {
    const exists = await prisma.user.findFirst({ where: { name: userid } });
    if (exists) return false;
    return true
}

export const getUserData = async (interaction: ChatInputCommandInteraction): Promise<User> => {
    const data = await prisma.user.findFirst({ where: { name: interaction.member.user.id } })
    return data;
}

export const registerUserData = async (interaction: ChatInputCommandInteraction): Promise<User> => {
    const date = new Date()
    const data = await prisma.user.create({ 
        data: { 
            name: interaction.member.user.id,
            username: interaction.member.user.username,
            lastDaily: (date.getFullYear()+ '-' + (date.getMonth() + 1) + '-' + date.getDate()).toString()
        } 
    })
    return data;
}

export const getLastDailyData = async (interaction: ChatInputCommandInteraction): Promise<string> => {
    const data = await prisma.user.findFirst({ where: { name: interaction.member.user.id } });
    return data.lastDaily
}

export const setLastDailyData = async (interaction: ChatInputCommandInteraction): Promise<void> => {
    const date = new Date()
    const data = await prisma.user.update({ where: { name: interaction.member.user.id }, data: { lastDaily: (date.getFullYear()+ '-' + (date.getMonth() + 1) + '-' + date.getDate()).toString()} });
    dailyMoney(interaction)
}
