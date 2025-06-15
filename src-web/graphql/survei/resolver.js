const firebase = require("../../../db");
const firestore = firebase.firestore();

const surveiResolver = {
  Query: {
    async getFormkuV2(_, args) {
      try {
        let surveiKlasikRef = await firestore
          .collection("form-klasik")
          .where("id_user", "==", args.idUser)
          .where("isPublished", "==", false)
          .get();
        // let listDataKlasik = surveiKlasikRef.docs.map(doc => {
        //   return new dataSurvei(doc.id, doc.data().judul, doc.data().tglUpdate.toDate(), "klasik")
        // })
        let listDataKlasik = surveiKlasikRef.docs.map((doc) => {
          return {
            id: doc.id,
            judul: doc.data().judul,
            tanggal: doc.data().tglUpdate._seconds,
            tipe: "klasik",
          };
        });

        let surveiKartuRef = await firestore
          .collection("form-kartu")
          .where("id_user", "==", args.idUser)
          .where("isPublished", "==", false)
          .get();
        let listDataKartu = surveiKartuRef.docs.map((doc) => {
          return {
            id: doc.id,
            judul: doc.data().judul,
            tanggal: doc.data().tglUpdate._seconds,
            tipe: "kartu",
          };
        });
        // let listDataKartu = surveiKartuRef.docs.map(doc => {
        //   return new dataSurvei(doc.id, doc.data().judul, doc.data().tglUpdate.toDate(), "kartu")
        // })
        let listData = listDataKlasik.concat(listDataKartu);
        listData = listData.sort(
          (objB, objA) => Number(objA.tanggal) - Number(objB.tanggal)
        );

        return {
          code: 200,
          status: "Success",
          data: listData,
          // data: result,
        };
      } catch (error) {
        return {
          code: 500,
          status: "Server Error : " + error,
          data: [],
        };
      }
    },
    async cariTemplate(_, args) {
      try {
        let keranjangRef = await firestore
          .collection("form-kartu")
          .where("isTemplate", "==", true)
          .get();
        let snapshot = keranjangRef.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        for (var e in snapshot) {
          console.log(snapshot[e].id);
        }
        let resp = true;
        if (resp) {
          return {
            code: 200,
            status: "success",
            data: "Undangan berhasil terkirim",
          };
        } else {
          return {
            code: 400,
            status: "failed",
            data: "Undangan gagal terkirim",
          };
        }
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: 0,
        };
      }
    },
    async getTemplateData(_, args) {
      try {
        let tipeForm = "";
        if (args.isKlasik) {
          tipeForm = "form-klasik";
        } else {
          tipeForm = "form-kartu";
        }
        let isKlasikX = tipeForm === "form-klasik";
        let formRef = await firestore
          .collection(tipeForm)
          .where("isTemplate", "==", true)
          .select("judul", "kategori", "petunjuk")
          .get();
        let snapshot = formRef.docs.map((doc) => {
          return { idForm: doc.id, ...doc.data() };
        });
        console.log(snapshot);
        return {
          code: 200,
          status: "success",
          data: snapshot,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: null,
        };
      }
    },
    async searchHSurvei(_, args) {
      try {
        let idTarget = [];

        const response = await fetch(
          "https://server-sql-dot-hei-survei-v1.et.r.appspot.com/api/search",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cari: args.search,
            }),
          }
        );
        const data = await response.json();
        const obj = JSON.parse(JSON.stringify(data));
        for (let index = 0; index < obj["hasil"].length; index++) {
          idTarget.push(obj["hasil"][index]);
        }
        // console.log(idTarget)

        let surveiRef = firestore
          .collection("h_survei")
          .orderBy(FieldPath.documentId())
          .where(FieldPath.documentId(), "in", idTarget)
          .where("diJual", "==", true);
        // let surveiRef = firestore.collection("h_survei").orderBy(FieldPath.documentId()).where(FieldPath.documentId(), 'in', idTarget).where('diJual', '==', true)

        if (args.kategori.length > 0) {
          surveiRef = surveiRef.where("kategori", "in", args.kategori);
          console.log("ada kategori filter");
        }

        const surveiResult = await surveiRef.get();
        let snapshot = surveiResult.docs.map((doc) => {
          return { id_survei: doc.id, ...doc.data() };
        });
        for (let e in snapshot) {
          snapshot[e].tanggal_penerbitan =
            snapshot[e].tanggal_penerbitan._seconds;
          if (snapshot[e].gambarSurvei == null) {
            snapshot[e].gambarSurvei = "";
          }
        }
        // console.log(snapshot)
        return {
          code: 200,
          status: "Success",
          data: snapshot,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: [],
        };
      }
    },
    async getSurveikuUtama(_, args) {
      try {
        //ambil survei dari h_survei
        const surveiRef = await firestore
          .collection("h_survei")
          .where("idUser", "==", args.idUser)
          .get();
        let snapshot = surveiRef.docs.map((doc) => {
          return { id_survei: doc.id, ...doc.data() };
        });
        snapshot.forEach(function (item) {
          item.tanggal_penerbitan = item.tanggal_penerbitan._seconds;
          if (item.gambarSurvei == null) {
            item.gambarSurvei = "";
          }
        });
        //

        //belanjan survei
        const beliRef = await firestore
          .collection("beli_survei")
          .where("idUser", "==", args.idUser)
          .get();
        let dataArr = [];
        beliRef.forEach((e) => {
          dataArr.push(e.data().idSurvei);
        });
        let snapshot2;
        if (dataArr.length == 0) {
          snapshot2 = [];
        } else {
          const beliSRef = await firestore
            .collection("h_survei")
            .where(FieldPath.documentId(), "in", dataArr)
            .get();
          snapshot2 = beliSRef.docs.map((doc) => {
            return { id_survei: doc.id, ...doc.data() };
          });
          snapshot2.forEach(function (item) {
            item.tanggal_penerbitan = item.tanggal_penerbitan._seconds;
            if (item.gambarSurvei == null) {
              item.gambarSurvei = "";
            }
          });
        }

        //ambil survei lagi dari sini
        console.log(dataArr);
        //
        return {
          code: 200,
          status: "Data berhasil diambil",
          survei: snapshot,
          beli: snapshot2,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Terjadi kesalahan server",
          survei: [],
          beli: [],
        };
      }
    },
    async getSurveiDetail(_, args) {
      try {
        //nanti
        let hSurveiRef = await firestore
          .collection("h_survei")
          .doc(args.idSurvei)
          .get();
        let idDSurvei = hSurveiRef.data().id_d_survei;

        let dataHSurvei = {
          id_survei: hSurveiRef.id,
          ...hSurveiRef.data(),
        };
        dataHSurvei.tanggal_penerbitan =
          dataHSurvei.tanggal_penerbitan._seconds;
        if (dataHSurvei.gambarSurvei == null) {
          dataHSurvei.gambarSurvei = "";
        }
        return {
          code: 200,
          status: "sukses mengambil data",
          hSurvei: dataHSurvei,
          // dSurvei:dataDSurvei,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Terjadi error server",
          hSurvei: null,
          // dSurvei:null,
        };
      }
    },
    async getSurveiByUser(_, args) {
      try {
        const surveiRef = await firestore
          .collection("h_survei")
          .where("idUser", "==", args.idUser)
          .where("status", "==", "aktif")
          .get();
        let snapshot = surveiRef.docs.map((doc) => {
          return { id_survei: doc.id, ...doc.data() };
        });
        snapshot.forEach(function (item) {
          item.tanggal_penerbitan = item.tanggal_penerbitan._seconds;
          if (item.gambarSurvei == null) {
            item.gambarSurvei = "";
          }
        });
        console.log(snapshot);
        return {
          code: 200,
          status: "Success",
          data: snapshot,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: [],
        };
      }
    },
    async cekPreviewSurvei(_, args) {
      try {
        let jenisSurvei = args.tipe === "klasik" ? "form-klasik" : "form-kartu";
        console.log(jenisSurvei);
        let formRef = await firestore
          .collection(jenisSurvei)
          .doc(args.idForm)
          .get();
        if (formRef.exists) {
          return {
            code: 200,
            status: "Success",
            data: "ijin diberikan",
          };
        } else {
          return {
            code: 401,
            status: "failed",
            data: "ijin tidak diberikan",
          };
        }
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: "",
        };
      }
    },
    async cekAuthSurvei(_, args) {
      try {
        let jenisSurvei = args.tipe === "klasik" ? "form-klasik" : "form-kartu";

        console.log(jenisSurvei);
        let formRef = await firestore
          .collection(jenisSurvei)
          .doc(args.idForm)
          .get();
        if (formRef.exists) {
          if (formRef.data().id_user === args.idUser) {
            return {
              code: 200,
              status: "Success",
              data: "Kredensial sesuai",
            };
          } else {
            return {
              code: 400,
              status: "failed",
              data: "Form bukan hak milik",
            };
          }
        } else {
          return {
            code: 401,
            status: "failed",
            data: "Tidak ada data",
          };
        }
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: "",
        };
      }
    },
    async getSurveiAktif(_, args) {
      try {
        //ambil survei dari h_survei
        const surveiRef = await firestore
          .collection("h_survei")
          .where("idUser", "==", args.idUser)
          .where("status", "==", "aktif")
          .get();
        let snapshot = surveiRef.docs.map((doc) => {
          return { id_survei: doc.id, ...doc.data() };
        });
        snapshot.forEach(function (item) {
          item.tanggal_penerbitan = item.tanggal_penerbitan._seconds;
          if (item.gambarSurvei == null) {
            item.gambarSurvei = "";
          }
        });
        return {
          code: 200,
          status: "Data berhasil diambil",
          survei: snapshot,
          beli: [],
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Terjadi kesalahan server",
          survei: [],
          beli: [],
        };
      }
    },
    async getSurveiPengecualian(_, args) {
      try {
        //ambil survei dari h_survei
        const surveiRef = await firestore
          .collection("h_survei")
          .where("idUser", "==", args.idUser)
          .select(FieldPath.documentId())
          .get();
        let snapshot = surveiRef.docs.map((doc) => {
          return { id_survei: doc.id };
        });
        //
        //ambil dari beli Survei
        const beliRef = await firestore
          .collection("beli_survei")
          .where("idUser", "==", args.idUser)
          .select("idSurvei")
          .get();
        let snapshotBeli = beliRef.docs.map((doc) => {
          return { id_survei: doc.data().idSurvei };
        });
        //
        let dataArr = [];
        if (!surveiRef.empty) {
          for (let e in snapshot) {
            dataArr.push(snapshot[e].id_survei);
          }
        }
        if (!beliRef.empty) {
          for (let e in snapshotBeli) {
            dataArr.push(snapshotBeli[e].id_survei);
          }
        }
        return {
          code: 200,
          status: "Success",
          data: dataArr,
        };
      } catch (error) {
        return {
          code: 500,
          status: "failed",
          data: [],
        };
      }
    },
  },
};

module.exports = { surveiResolver };
