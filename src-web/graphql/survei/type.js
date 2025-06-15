const { gql } = require("apollo-server-express");

const surveiType = gql`
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
    urlGambar: String!
  }
  type responSurveiku {
    code: Int!
    status: String!
    survei: [HSurvei]
    beli: [HSurvei]
  }
  type responHSurvei {
    code: Int!
    status: String!
    data: [HSurvei]
  }
  type responSurvei {
    code: Int!
    status: String!
    hSurvei: HSurvei
    #dSurvei:DSurvei
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
    emailUser: String
    #dibawah bagian DSurvei
    hargaPerPartisipan: Int
    insentifPerPartisipan: Int
    demografiUsia: Int
    demografiLokasi: [String]
    demografiInterest: [String]
    diJual: Boolean
    hargaJual: Int
    idForm: String
    #penambahan gamabr
    gambarSurvei: String
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

  type Survei {
    judul: String!
    deskripsi: String
    jumlahPartisipan: Int!
    batasPartisipan: Int!
    isKlasik: Int!
    status: String!
    tanggal: String!
    durasi: Int!
    harga: Int!
    kategori: String!
    id_form: String!
    id_survei: String!
  }

  type ResponStandar {
    status: String!
    data: String!
    code: Int!
  }
  type ResponTemplateData {
    status: String!
    code: Int!
    data: [TemplateData]
  }

  type TemplateData {
    judul: String
    idForm: String
    petunjuk: String
    kategori: String
  }
`;

module.exports = { surveiType };
