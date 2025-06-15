const { gql } = require("apollo-server-express");

const surveiTypes = gql`
  type surveiDetail {
    code: Int!
    status: String!
    survei: HSurvei
    user: userDetail
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

  type SurveiX {
    judul: String!
    deskripsi: String
    id_form: String!
    id_survei: String!
    isKlasik: Int!
    status: String!
    tanggal: String!
    durasi: Int!
    harga: Int!
    kategori: String!
  }
  type responSurveiDemo {
    code: Int!
    status: String!
    data: [SurveiDemo]
  }
  type SurveiDemo {
    judul: String
    insentif: Int
    tanggal_penerbitan: Int
    deskripsi: String
    isKlasik: Boolean
    durasi: Int
    status: String
    id_survei: String
    kategori: String
    demografiUsia: Int!
    demografiLokasi: [String]
    demografiInterest: [String]
    gambarSurvei: String
  }
  type HSurvei {
    judul: String
    insentif: Int
    tanggal_penerbitan: Int
    deskripsi: String
    isKlasik: Boolean
    durasi: Int
    status: String
    id_survei: String
    kategori: String
    #dSurvei dibawah
    hargaPerPartisipan: Int
    insentifPerPartisipan: Int
    demografiUsia: Int
    demografiLokasi: [String]
    demografiInterest: [String]
    batasPartisipan: Int
    idForm: String
    gambarSurvei: String
  }

  type responHSurvei {
    code: Int!
    status: String!
    data: [HSurvei]
  }

  type ResponSurvei {
    code: Int!
    status: String!
    data: [SurveiX]
  }
`;
module.exports = { surveiTypes };
