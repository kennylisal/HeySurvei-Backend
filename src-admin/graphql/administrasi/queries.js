const { gql } = require("apollo-server-express");

const adminQueries = gql`
  extend type Query {
    cobaFetch: ResponStandar
    cobaTanggal(tglAwal: Int!, tglAkhir: Int!): ResponStandar

    getPublishData(idForm: String!, tipe: String!): ResponPublishData!

    getAllKota: responString!

    getAllInterest: responString!

    getAllUserAdmin: ResponUserAdmin!

    getReward: responReward

    getJumlahSurveiAktif: ResponAngka!

    getUserAktif: ResponAngka!

    getJumlahSurveiTerbeli: ResponAngka!

    getJumlahTerjawab: ResponAngka!

    getKeuntunganHSurvei: ResponAngka!

    getKeuntunganOrder: ResponAngka!

    getBerdasarkanBulan(bulan: Int!): ResponAngka!

    getSurveiBanned: ResponAngka!

    getIdFormSurvei(idSurvei: String!): ResponFormLaporan

    #ekperimen laporan

    getLaporanSurvei(tglAwal: Int!, tglAkhir: Int!): responHSurvei

    getOrderLaporan(tglAwal: Int!, tglAkhir: Int!): responOrder

    #fitur tambahan pesan
    getKeluhanSurvei: responKeluhan!
    getPengajuanPencairan: responPencairan!
    getPengajuanPencairanSurveyor: responPencairan!

    getAllKategori: responDataKategori
  }
`;

module.exports = { adminQueries };
