const { authMutation } = require("./graphql/auth/mutations");
const { authQueries } = require("./graphql/auth/queries");
const { authResolver } = require("./graphql/auth/resolver");
const { authType } = require("./graphql/auth/type");
const { publishingMutation } = require("./graphql/survei-publish/mutation");
const { publishingQueries } = require("./graphql/survei-publish/queries");
const { publishingResolvers } = require("./graphql/survei-publish/resolver");
const { publishingTypes } = require("./graphql/survei-publish/type");
const { surveiQueries } = require("./graphql/survei/queries");
const { surveiType } = require("./graphql/survei/type");
const { transaksiMutation } = require("./graphql/transaksi/mutation");
const { transaksiQueries } = require("./graphql/transaksi/queries");
const { transaksiResolver } = require("./graphql/transaksi/resolver");
const { transaksiTypes } = require("./graphql/transaksi/types");
const { gql } = require("apollo-server-express");

const baseSchema = gql`
  type Query
  type Mutation
`;

const typeDefs = [
  baseSchema,
  authMutation,
  authQueries,
  authType,
  surveiType,
  surveiQueries,
  publishingMutation,
  publishingTypes,
  publishingQueries,
  transaksiMutation,
  transaksiQueries,
  transaksiTypes,
];

const resolver = {
  Query: {
    ...authResolver.Query,
    ...transaksiResolver.Query,
    ...publishingResolvers.Query,
    ...transaksiResolver.Query,
  },
  Mutation: {
    ...authResolver.Mutation,
    ...transaksiResolver.Mutation,
    ...publishingResolvers.Mutation,
  },
};

module.exports = { typeDefs, resolver };
