// graphql
const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} = graphql;
const { UserInputError } = require("apollo-server");

// Object Types
const { AuthDataType, MessageType } = require("./ObjectType");

// Input Types
const {
  RegisterUserInputType,
  LoginUserInputType,
  SendMessageInputType,
} = require("./InputType");

// Models
const { User, Message } = require("../models");

// validators
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../util/validators");

// modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/jwt_key");
const checkAuth = require("../util/checkAuth");

function generateToken(user) {
  return jwt.sign(
    {
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = new GraphQLObjectType({
  name: "MutationType",
  fields: {
    // register a new user
    registerUser: {
      type: AuthDataType,
      args: {
        input: {
          type: RegisterUserInputType,
        },
      },
      async resolve(_, args) {
        const {
          username,
          email,
          password,
          confirmPassword,
          imageUrl,
        } = args.input;

        try {
          // validate user input details
          const { valid, errors } = validateRegisterInput(
            username,
            email,
            password,
            confirmPassword
          );
          if (!valid) {
            throw new UserInputError("Error", { errors });
          }
          // // check for a duplicate user
          // const userByEmail = await User.findOne({ where: { email } });
          // if (userByEmail) {
          //   throw new UserInputError("Email is taken", {
          //     error: {
          //       email: "Email is already in use",
          //     },
          //   });
          // }

          // hash password
          const hasedPassword = await bcrypt.hash(password, 6);
          const newUser = await User.create({
            username,
            email,
            password: hasedPassword,
          });

          // create authentication token
          const token = generateToken(newUser);

          return {
            email: newUser.email,
            username: newUser.username,
            token: token,
          };
        } catch (error) {
          if (error.name === "SequelizeUniqueConstraintError") {
            throw new UserInputError("Bad input", {
              error: {
                email: "Username or Email is already in use",
              },
            });
          }
          throw error;
        }
      },
    },

    // login user
    login: {
      type: AuthDataType,
      args: {
        input: {
          type: LoginUserInputType,
        },
      },
      async resolve(_, args) {
        const { username, password } = args.input;
        // validate user inputs
        const { valid, errors } = validateLoginInput(username, password);
        if (!valid) {
          throw new UserInputError("Errors", { errors });
        }
        const user = await User.findOne({ where: { username } });

        if (!user) {
          errors.username = "User not found";
          throw new UserInputError("User not found", { errors });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          errors.password = "Password is incorrect";
          throw new UserInputError("Password is incorrect", { errors });
        }
        // generate authToken
        const token = generateToken(user);
        return {
          email: user.email,
          username: user.username,
          token: token,
        };
      },
    },

    // send message
    sendMessage: {
      type: MessageType,
      args: {
        input: {
          type: SendMessageInputType,
        },
      },
      async resolve(parent, args, context) {
        const { to, content } = args.input;
        const user = checkAuth(context);
        try {
          const recipient = await User.findOne({ where: { username: to } });
          if (!recipient) {
            throw new UserInputError("Recipient does not exist!");
          }
          if (recipient.username === user.username) {
            throw new UserInputError("You cannot send messages to yourself!");
          }
          if (content.trim() === "") {
            throw new UserInputError("Message body cannot be empty");
          }
          const message = await Message.create({
            from: user.username,
            to,
            content,
          });
          return message;
        } catch (err) {
          throw err;
        }
      },
    },
  },
});
