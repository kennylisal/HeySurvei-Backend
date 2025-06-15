const firebase = require("../../../db");
const firestore = firebase.firestore();

const FAQResolvers = {
  Query: {
    async getFAQ(_, args) {
      try {
        let ref = await firestore.collection("faq").get();
        if (ref.empty) {
          return {
            code: 400,
            status: "data kosong",
            data: [],
          };
        } else {
          let result = ref.docs.map((doc) => {
            return {
              id: doc.id,
              pertanyaan: doc.data().pertanyaan,
              jawaban: doc.data().jawaban,
            };
          });
          return {
            code: 200,
            status: "data berhasil diambil",
            data: result,
          };
        }
      } catch (error) {
        console.log(e);
        return {
          code: 500,
          status: "Server Error : " + error,
          data: [],
        };
      }
    },
  },
  Mutation: {
    async hapusFAQ(_, args) {
      try {
        const faqRef = await firestore
          .collection("faq")
          .doc(args.idFAQ)
          .delete();
        return {
          status: "success",
          data: "FAQ berhasil dihapus",
          code: 200,
        };
      } catch (error) {
        return {
          status: "fail",
          data: "Terjadi kesalah Server: " + error,
          code: 500,
        };
      }
    },
    async updateFAQ(_, args) {
      try {
        const faqRef = await firestore
          .collection("faq")
          .doc(args.idFAQ)
          .update({
            pertanyaan: args.pertanyaan,
            jawaban: args.jawaban,
          });
        return {
          status: "success",
          data: "FAQ berhasil diupdate",
          code: 200,
        };
      } catch (error) {
        return {
          status: "fail",
          data: "Terjadi kesalah Server: " + error,
          code: 500,
        };
      }
    },
    async buatFAQ(_, args) {
      try {
        const faqRef = await firestore.collection("faq").doc(args.idFAQ).set({
          pertanyaan: args.pertanyaan,
          jawaban: args.jawaban,
        });
        return {
          status: "success",
          data: "FAQ berhasil dibuat",
          code: 200,
        };
      } catch (error) {
        return {
          status: "fail",
          data: "Terjadi kesalah Server: " + error,
          code: 500,
        };
      }
    },
  },
};

module.exports = { FAQResolvers };
