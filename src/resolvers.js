const bcrypt = require('bcryptjs');
const { prisma } = require('./db');
const { generateToken, verifyToken } = require('./auth');

const resolvers = {
  Query: {
    users: async (parent, args, context) => {
      console.log(context)
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await prisma.users.findMany();
    },
  },
  Mutation: {
    signup: async (parent, { name, username, email, password }) => {
      const existingUser = await prisma.users.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.users.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
        },
      });

      return generateToken(newUser);
    },
    login: async (parent, { email, password }) => {
      const user = await prisma.users.findUnique({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Invalid password');
      }

      return generateToken(user);
    },
  },
};

module.exports = resolvers;
