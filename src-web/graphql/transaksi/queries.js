const { gql } = require("apollo-server-express");

const transaksiQueries = gql`
  extend type Query {
    #transaksiController
    getSejarahUser(idUser: String!): responTransaksi
    getOrderUser(idUser: String!): responOrderUser
    getOrderDetail(idUser: String!): responHSurvei
    getCartKu(idUser: String!): responCart
    getSejarahOrder(idUser: String!): responSejarahOrder
    getOrderPilihan(idOrder: String!): responOrderUser
    getSPP(idUser: String!): responSPP
    getSejarahPencairan(idUser: String!): ResponPencairan!
    getSejarahPembelian(idUser: String!): responPembelian!
  }
`;

module.exports = { transaksiQueries };
