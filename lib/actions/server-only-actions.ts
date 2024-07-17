'use server'

import prisma from "../db"

export async function getTotalMembership ()
{
    return await prisma.members.count();
}

export async function males ()
{
    return await prisma.members.count({where:{gender: 'male'}})
}


export async function females ()
{
    return await prisma.members.count({where:{gender: 'female'}})
}

