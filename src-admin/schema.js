const { gql } = require("apollo-server-express");
const { FAQMutations } = require("./graphql/FAQ/mutation");
const { FAQQueries } = require("./graphql/FAQ/queries");
const { FAQTypeDefs } = require("./graphql/FAQ/types");
const { FAQResolvers } = require("./graphql/FAQ/resolvers");
const { surveiMutations } = require("./graphql/survei/mutation");
const { surveiQueries } = require("./graphql/survei/queries");
const { surveiTypes } = require("./graphql/survei/types");
const { surveiResolvers } = require("./graphql/survei/resolvers");
const { administrasiType } = require("./graphql/administrasi/types");
const { administrasiMutation } = require("./graphql/administrasi/mutation");
const { adminQueries } = require("./graphql/administrasi/queries");
const { adminResolvers } = require("./graphql/administrasi/resolver");

const baseSchema = gql`
  type Query
  type Mutation
`;

const typeDefs = [
  baseSchema,
  FAQQueries,
  FAQMutations,
  FAQTypeDefs,
  surveiMutations,
  surveiQueries,
  surveiTypes,
  administrasiType,
  administrasiMutation,
  adminQueries,
];

const resolvers = {
  Query: {
    ...FAQResolvers.Query,
    ...surveiResolvers.Query,
    ...adminResolvers.Query,
  },
  Mutation: {
    ...FAQResolvers.Mutation,
    ...surveiResolvers.Mutation,
    ...adminResolvers.Mutation,
  },
};

module.exports = { typeDefs, resolvers };
