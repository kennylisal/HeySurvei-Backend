const { gql } = require("apollo-server-express");

const publishingTypes = gql`
  type ResponFormLaporan {
    status: String!
    code: Int!
    idForm: String!
    judul: String!
    deskripsi: String!
  }

  type ResponJudul {
    status: String!
    data: [String]
    code: Int!
  }

  type ResponLogin {
    pesan: String!
    id: String!
    code: Int!
  }

  type Percobaan {
    judul: String!
    id: String!
    tanggal: String!
    harga: Int!
  }

  type ResponPercobaan {
    status: String!
    code: Int!
    data: [Percobaan]
  }

  type Kategori {
    id: String!
    nama: String!
  }

  type namaArray {
    judul: String!
    pecahan_nama: [String!]
  }

  type responSuvei {
    code: Int!
    message: String!
    data: [Survei]
  }

  type responKategori {
    code: Int!
    data: String!
    message: String!
  }

  type responDataKategori {
    code: Int!
    message: String!
    data: [Kategori]
  }

  type responReward {
    code: Int!
    message: String!
    insentif: Int!
    special: Int!
    biaya: Int!
  }

  type ResponPublishData {
    code: Int!
    status: String!
    judul: String!
    tipe: String!
    jumlahSoal: Int!
  }
`;

module.exports = { publishingTypes };
