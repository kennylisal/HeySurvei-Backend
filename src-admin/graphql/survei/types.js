const { gql } = require("apollo-server-express");

const surveiTypes = gql`
  type responHSurvei {
    code: Int!
    status: String!
    data: [HSurvei]
  }
  type ResponAngka {
    status: String!
    data: Int!
    code: Int!
  }

  type responDataKategori {
    code: Int!
    message: String!
    data: [Kategori]
  }

  type responDraft {
    code: Int!
    status: String!
    data: [draft]
  }

  type draft {
    judul: String!
    tanggal: Int!
    tipe: String!
    id: String!
  }

  type responString {
    code: Int!
    status: String!
    data: [String!]
  }

  type HSurvei {
    judul: String
    harga: Int
    tanggal_penerbitan: Int
    deskripsi: String
    isKlasik: Boolean
    durasi: Int
    status: String
    jumlahPartisipan: Int
    batasPartisipan: Int
    id_survei: String
    kategori: String
    idUser: String
    hargaPerPartisipan: Int
    insentifPerPartisipan: Int
    demografiUsia: Int
    demografiLokasi: [String]
    demografiInterest: [String]
    diJual: Boolean
    hargaJual: Int
    idForm: String
    emailUser: String
  }

  type responSurveiku {
    code: Int!
    status: String!
    survei: [HSurvei]
    beli: [HSurvei]
  }

  type responSurvei {
    code: Int!
    status: String!
    hSurvei: HSurvei
  }

  type Kategori {
    id: String!
    nama: String!
  }

  input AddSurveiInput {
    judul: String!
    deskripsi: String
    batasPartisipan: Int!
    isKlasik: Boolean!
    status: String!
    durasi: Int!
    harga: Int!
    kategori: String!
    pakaiDemografi: Boolean!
    emailUser: String!
  }

  input dSurveiInput {
    hargaPerPartisipan: Int!
    insentifPerPartisipan: Int!
    demografiUsia: Int!
    demografiLokasi: [String]
    demografiInterest: [String]
    batasPartisipan: Int!
    diJual: Boolean!
    hargaJual: Int!
  }
`;

module.exports = { surveiTypes };
