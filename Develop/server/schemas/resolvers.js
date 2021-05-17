const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
        if (context.user) {
          const userData = await User.findOne({ _id: context.user._id })
            .select('-__v -password')
            .populate('thoughts')
            .populate('friends');
  
          return userData;
        }
  
        throw new AuthenticationError('Not logged in');
      },  
    users: async () => {
      return User.find()
      .select('-__v -password')
      .populate('books')
    }
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('That user does not exist');
      }

      if (password !== user.password) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    saveBook: async (parent, { thoughtId, reactionBody }, context) => {
        if (context.user) {
          const updatedThought = await Thought.findOneAndUpdate(
            { _id: thoughtId },
            { $push: { reactions: { reactionBody, username: context.user.username } } },
            { new: true, runValidators: true }
          );
  
          return updatedThought;
        }
  
        throw new AuthenticationError('You need to be logged in!');
      },

    removeBook: async (parent, args, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: args.bookId } } },
            { new: true }
          )
          return updatedUser;
        }
  
        throw new AuthenticationError('You need to be logged in!');
      }

  }

};

module.exports = resolvers;
