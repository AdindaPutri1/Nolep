import prisma from '../lib/db';

export const createUser = async (username, email, password) => {
  return await prisma.user_Account.create({
    data: { username, email, password },
  });
};

export const findUserByEmail = async (email) => {
  return await prisma.user_Account.findUnique({ where: { email } });
};

export const findUserByUsername = async (username) => {
  return await prisma.user_Account.findUnique({ where: { username } });
};