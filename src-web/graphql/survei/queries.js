const { gql } = require("apollo-server-express");

const surveiQueries = gql`
  extend type Query {
    cariTemplate(judul: String!): ResponStandar!
    getTemplateData(isKlasik: Boolean): ResponTemplateData!
    searchHSurvei(search: String!, kategori: [String]!): responHSurvei!
    #surveikuController
    getSurveikuUtama(idUser: String!): responSurveiku
    getSurveiAktif(idUser: String!): responSurveiku
    getSurveiPengecualian(idUser: String!): responString
    cekAuthSurvei(idForm: String!, idUser: String!, tipe: String): ResponStandar
    cekPreviewSurvei(idForm: String!, tipe: String): ResponStandar
    getSurveiByUser(idUser: String!): responHSurvei!
    getSurveiDetail(idSurvei: String!): responSurvei
    getFormkuV2(idUser: String!): responDraft #ini draft juga
  }
`;

module.exports = { surveiQueries };
