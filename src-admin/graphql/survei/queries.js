const { gql } = require("apollo-server-express");

const surveiQueries = gql`
  extend type Query {
    getHSurveiTerbaru: responHSurvei!

    getAllSurveiReport: responHSurvei!

    getFormkuV2(idUser: String!): responDraft

    #surveikuController
    getSurveikuUtama(idUser: String!): responSurveiku

    getSurveiDetail(idSurvei: String!): responSurvei
  }
`;

module.exports = { surveiQueries };
