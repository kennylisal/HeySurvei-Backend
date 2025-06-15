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
};

module.exports = { FAQResolvers };
