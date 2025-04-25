const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Damjanche", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

const UserModel = mongoose.model("User", {
  name: { type: String, required: true },
  email: { type: String, required: true },
});

const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    addUser(name: String!, email: String!): User!
    deleteUser(id: ID!): User
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      return await UserModel.find();
    },
  },
  Mutation: {
    addUser: async (_, { name, email }) => {
      const newUser = new UserModel({ name, email });
      await newUser.save();
      return newUser;
    },
    deleteUser: async (_, { id }) => {
      const deletedUser = await UserModel.findByIdAndDelete(id);
      return deletedUser;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
