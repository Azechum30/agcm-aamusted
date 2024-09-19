'use server'
import 'server-only'
import prisma from "../db"

export async function getTotalMembership ()
{
    return await prisma.member.count();
}

export async function males ()
{
    return await prisma.member.count({where:{gender: 'male'}})
}


export async function females ()
{
    return await prisma.member.count({where:{gender: 'female'}})
}

