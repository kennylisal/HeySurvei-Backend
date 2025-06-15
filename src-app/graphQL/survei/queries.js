const { gql } = require("apollo-server-express");

const surveiQueries = gql`
  extend type Query {
    getAllSurvei: ResponSurvei!

    #SearchController
    searchSurveiNormal(search: String!): responHSurvei!
    getSurveiDetail(idSurvei: String): surveiDetail
    getDefaultSurvei: responHSurvei

    #controller-halaman utama
    getSurveiTerbaru: responHSurvei
    getSurveiUjiCoba: responHSurvei
    #Detail-controller
    cekIsiSurvei(idSurvei: String!): ResponStandar!
    getIdForm(idSurvei: String!): ResponStandar!

    #Rekomendasi
    getAllDemoSurvei: responSurveiDemo!

    #pengecekan survei
    getSurveiTerlarang(idUser: String!): responString!
    getSurveiTerlarangUjiCoba(idUser: String!): responString!

    rekomendasiPakaiPengecekan: ResponStandar
    demografiBisaUpdate: ResponStandar
  }
`;

module.exports = { surveiQueries };
