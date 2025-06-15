const { gql } = require("apollo-server-express");

const surveiMutations = gql`
  extend type Mutation {
    #BuatFormKlasik awal
    buatFormKlasik(idForm: String!, idUser: String!): ResponStandar

    buatFormKartu(idForm: String!, idUser: String!): ResponStandar

    publishSurveiBaru(
      survei: AddSurveiInput!
      dSurvei: dSurveiInput
      idForm: String!
      idUser: String!
    ): ResponStandar
  }
`;

module.exports = { surveiMutations };
