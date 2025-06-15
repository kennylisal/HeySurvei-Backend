const { gql } = require("apollo-server-express");

const userProfileQueries = gql`
  extend type Query {
    #profileController
    getAllKota: responString!
    getAllInterest: responString!
    getAllHistory(idUser: String!): responHistory
    cekNoHp(noHP: String!): ResponStandar!

    getSejarahPencairan(idUser: String!): ResponPencairan!
  }
`;

module.exports = { userProfileQueries };
