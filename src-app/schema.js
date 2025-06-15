const { gql } = require("apollo-server-express");
const { FAQQueries } = require("./graphQL/FAQ/queries");
const { FAQType } = require("./graphQL/FAQ/type");
const { FAQResolvers } = require("./graphQL/FAQ/resolver");
const { authMutation } = require("./graphQL/auth/mutation");
const { authQueries } = require("./graphQL/auth/queries");
const { authType } = require("./graphQL/auth/type");
const { authResolver } = require("./graphQL/auth/resolver");
const { surveiQueries } = require("./graphQL/survei/queries");
const { surveiTypes } = require("./graphQL/survei/type");
const { surveiMutations } = require("./graphQL/survei/mutation");
const { surveiResolver } = require("./graphQL/survei/resolver");
const { userProfileMutaion } = require("./graphQL/user-profile/mutation");
const { userProfileQueries } = require("./graphQL/user-profile/queries");
const { userProfileType } = require("./graphQL/user-profile/type");
const { userProfileResolver } = require("./graphQL/user-profile/resolver");

const baseSchema = gql`
  type Query
  type Mutation
`;

const typeDefs = [
  baseSchema,
  FAQQueries,
  FAQType,
  authMutation,
  authQueries,
  authType,
  surveiQueries,
  surveiTypes,
  surveiMutations,
  userProfileMutaion,
  userProfileQueries,
  userProfileType,
];

const resolvers = {
  Query: {
    ...FAQResolvers.Query,
    ...authResolver.Query,
    ...surveiResolver.Query,
    ...userProfileResolver.Query,
  },
  Mutation: {
    ...authResolver.Mutation,
    ...surveiResolver.Mutation,
    ...userProfileResolver.Mutation,
  },
};

module.exports = { typeDefs, resolvers };
