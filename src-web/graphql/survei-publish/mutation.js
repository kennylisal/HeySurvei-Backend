const { gql } = require("apollo-server-express");

const publishingMutation = gql`
  extend type Mutation {
    hapusDraft(idForm: String!, isKlasik: Boolean!): ResponStandar!
    copasData: ResponStandar
    publishSurveiBaru(
      survei: AddSurveiInput!
      dSurvei: dSurveiInput
      idForm: String!
      idUser: String!
    ): ResponStandar
    publishSurveiMidtrans(
      survei: AddSurveiInput!
      dSurvei: dSurveiInput
      idForm: String!
      idUser: String!
      idSurvei: String
    ): ResponStandar
    buatFormKlasik(idForm: String!, idUser: String!): ResponStandar
    buatFormKartu(idForm: String!, idUser: String!): ResponStandar
  }
`;
module.exports = { publishingMutation };
