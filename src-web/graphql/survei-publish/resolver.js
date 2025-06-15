const firebase = require("../../../db");
const firestore = firebase.firestore();

const publishingResolvers = {
  Query: {
    async broadcastPengerjaanSurvei(_, args) {
      try {
        let mailList = args.listEmail;
        const mailConfigurations = {
          from: "Hey Survei",
          subject: "Invitasi Pengerjaan Survei",
          text: `Ayo kerjakan Survei baru : ${args.judul} \nBerikut adalah linknya : ${args.link}`,
          to: mailList,
        };
        let resp = await wrapedSendMail(mailConfigurations);
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
    async getAllInterest(_, args) {
      try {
        let kategoriRef = await firestore
          .collection("interest")
          .orderBy("nama")
          .get();

        var arrTemp = [];
        var hasil = kategoriRef.docs.forEach((element) => {
          arrTemp.push(element.data().nama);
        });

        return {
          code: 200,
          status: "Data berhasil diambil",
          data: arrTemp,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Server Error, akibat : " + e,
          data: [],
        };
      }
    },
    async getAllKota(_, args) {
      try {
        let kategoriRef = await firestore.collection("list_kota").get();

        var arrTemp = [];
        var hasil = kategoriRef.docs.forEach((element) => {
          arrTemp.push(element.data().nama_kota);
        });
        return {
          code: 200,
          status: "Data berhasil diambil",
          data: arrTemp,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Server Error, akibat : " + e,
          data: [],
        };
      }
    },

    async getPublishData(_, args) {
      try {
        let tipe = "";

        if (args.tipe == "kartu") tipe = "form-kartu";
        else tipe = "form-klasik";

        // if(args.tipe == "kartu") tipe = 'form-kartu'
        // else tipe = 'form-v2'

        let formRef = await firestore.collection(tipe).doc(args.idForm).get();
        console.log(formRef.data());
        return {
          code: 200,
          status: "success",
          judul: formRef.data().judul,
          tipe: args.tipe,
          jumlahSoal: formRef.data().daftarSoal.length,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          judul: "",
          tipe: "",
          jumlahSoal: -1,
        };
      }
    },
    //

    async getReward(_, args) {
      try {
        let rewardRef = await firestore
          .collection("hargaSurvei")
          .doc("rXxk9XqcSu9Rh5djur6a")
          .get();
        console.log(rewardRef.data());
        return {
          code: 200,
          message: "Data berhasil diambil",
          insentif: rewardRef.data().hargaInsentif,
          biaya: rewardRef.data().hargaSurvei,
          special: rewardRef.data().hargaSpesial,
        };
      } catch (error) {
        return {
          code: 500,
          message: "Terjadi kesalaha server" + error,
          insentif: 0,
          biaya: 0,
          special: 0,
        };
      }
    },

    async getAllKategori(_, args) {
      try {
        let kategoriRef = await firestore
          .collection("kategori")
          .orderBy("nama")
          .get();
        const result = kategoriRef.docs.map((doc) => {
          return {
            id: doc.id,
            nama: doc.data().nama,
          };
        });
        return {
          code: 200,
          message: "Data berhasil diambil",
          data: result,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          message: "Server Error, akibat : " + e,
          data: [],
        };
      }
    },
  },
  Mutation: {
    async hapusDraft(_, args) {
      try {
        let form = "";
        if (args.isKlasik) form = "form-klasik";
        else form = "form-kartu";
        let formRef = await firestore
          .collection(form)
          .doc(args.idForm)
          .delete();
        return {
          code: 200,
          status: "success",
          data: "Penghapusan sukses",
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: "Terjadi Kesalahan Server",
        };
      }
    },
    async publishSurveiMidtrans(_, args) {
      try {
        //generate idSurvei mu disini nnt pakai UUid
        let idBaruH = "HSV - " + args.idSurvei;
        console.log(args);

        let batch = firestore.batch();

        batch.create(firestore.collection("p_survei").doc(idBaruH), {
          judul: args.survei.judul,
          harga: args.survei.harga,
          tanggal_penerbitan: Timestamp.now(),
          deskripsi: args.survei.deskripsi,
          durasi: args.survei.durasi,
          jumlahPartisipan: 0,
          batasPartisipan: args.survei.batasPartisipan,
          isKlasik: args.survei.isKlasik,
          status: args.survei.status,
          kategori: args.survei.kategori,
          idUser: args.idUser,
          pakaiDemografi: args.survei.pakaiDemografi,
          diJual: args.dSurvei.diJual,
          hargaJual: args.dSurvei.hargaJual,
          emailUser: args.survei.emailUser,
          //dibawah yg tambahan d_survei
          hargaPerPartisipan: args.dSurvei.hargaPerPartisipan,
          insentifPerPartisipan: args.dSurvei.insentifPerPartisipan,
          demografiUsia: args.dSurvei.demografiUsia,
          demografiLokasi: args.dSurvei.demografiLokasi,
          demografiInterest: args.dSurvei.demografiInterest,
          batasPartisipan: args.dSurvei.batasPartisipan,
          idForm: args.idForm,
          diJual: args.dSurvei.diJual,
          hargaJual: args.dSurvei.hargaJual,
          //tambahanGambar
          gambarSurvei: args.dSurvei.urlGambar,
        });
        if (args.survei.isKlasik) {
          batch.update(firestore.collection("form-klasik").doc(args.idForm), {
            isPublished: true,
          });
        } else {
          batch.update(firestore.collection("form-kartu").doc(args.idForm), {
            isPublished: true,
          });
        }
        let judulSurvei = args.survei.judul;
        const response = await fetch(
          "https://server-sql-dot-hei-survei-v1.et.r.appspot.com/api/push",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idSurvei: idBaruH,
              namaSurvei: judulSurvei,
            }),
          }
        );
        const data = await response.json();

        const obj = JSON.parse(JSON.stringify(data));
        if (obj["msg"] === "berhasil") {
          console.log("ya berhasil");
          await batch.commit();
          return {
            status: "success",
            data: "Survei berhasil ditambahkan",
            code: 200,
          };
        } else {
          console.log("gagal");
          return {
            status: "failed",
            data: "gagal ditambahkan",
            code: 400,
          };
        }
      } catch (error) {
        return {
          status: "fail",
          data: "Terjadi kesalah Server: " + error,
          code: 500,
        };
      }
    },

    async publishSurveiBaru(_, args) {
      try {
        //generate idSurvei mu disini nnt pakai UUid
        let idBaruH = "HSV - " + uuidv4().substring(0, 7);
        console.log(args);

        let batch = firestore.batch();

        batch.create(firestore.collection("h_survei").doc(idBaruH), {
          judul: args.survei.judul,
          harga: args.survei.harga,
          tanggal_penerbitan: Timestamp.now(),
          deskripsi: args.survei.deskripsi,
          durasi: args.survei.durasi,
          jumlahPartisipan: 0,
          batasPartisipan: args.survei.batasPartisipan,
          isKlasik: args.survei.isKlasik,
          status: args.survei.status,
          kategori: args.survei.kategori,
          idUser: args.idUser,
          pakaiDemografi: args.survei.pakaiDemografi,
          diJual: args.dSurvei.diJual,
          hargaJual: args.dSurvei.hargaJual,
          emailUser: args.survei.emailUser,
          //dibawah yg tambahan d_survei
          hargaPerPartisipan: args.dSurvei.hargaPerPartisipan,
          insentifPerPartisipan: args.dSurvei.insentifPerPartisipan,
          demografiUsia: args.dSurvei.demografiUsia,
          demografiLokasi: args.dSurvei.demografiLokasi,
          demografiInterest: args.dSurvei.demografiInterest,
          batasPartisipan: args.dSurvei.batasPartisipan,
          idForm: args.idForm,
          diJual: args.dSurvei.diJual,
          hargaJual: args.dSurvei.hargaJual,
        });
        if (args.survei.isKlasik) {
          batch.update(firestore.collection("form-klasik").doc(args.idForm), {
            isPublished: true,
          });
        } else {
          batch.update(firestore.collection("form-kartu").doc(args.idForm), {
            isPublished: true,
          });
        }
        let judulSurvei = args.survei.judul;
        const response = await fetch(
          "https://server-sql-dot-hei-survei-v1.et.r.appspot.com/api/push",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idSurvei: idBaruH,
              namaSurvei: judulSurvei,
            }),
          }
        );
        const data = await response.json();

        const obj = JSON.parse(JSON.stringify(data));
        if (obj["msg"] === "berhasil") {
          console.log("ya berhasil");
          await batch.commit();
          return {
            status: "success",
            data: "Survei berhasil ditambahkan",
            code: 200,
          };
        } else {
          console.log("gagal");
          return {
            status: "failed",
            data: "gagal ditambahkan",
            code: 400,
          };
        }
      } catch (error) {
        return {
          status: "fail",
          data: "Terjadi kesalah Server: " + error,
          code: 500,
        };
      }
    },
    async buatFormKlasik(_, args) {
      try {
        const surveiRef = await firestore
          .collection("form-klasik")
          .doc(args.idForm)
          .set({
            judul: "Judul",
            petunjuk: "",

            tglUpdate: Timestamp.now(),
            isPublished: false,
            id_user: args.idUser,
            daftarSoal: [
              {
                idSoal: "pembatas - " + uuidv4().substring(0, 7),
                bagian: "",
                isPembatas: true,
                petunjuk: [{ insert: "Petunjuk Bagian\n" }],
              },
              {
                idSoal: uuidv4().substring(0, 7),
                isWajib: 0,
                lainnya: 0,
                listJawaban: [
                  {
                    idJawaban: "jawaban-" + uuidv4().substring(0, 7),
                    jawaban: "",
                  },
                ],
                pertanyaanSoal: [{ insert: "Soal Pertanyaan\n" }],
                isBergambar: 0,
                tipeSoal: "Pilihan Ganda",
              },
            ],
            daftarSoalCabang: [],
          });
        console.log("ini id baru klaik -> " + args.idForm);
        return {
          status: "success",
          data: "Survei berhasil ditambahkan",
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
    async buatFormKartu(_, args) {
      try {
        const surveiRef = await firestore
          .collection("form-kartu")
          .doc(args.idForm)
          .set({
            judul: "",
            petunjuk: "",

            tglUpdate: Timestamp.now(),
            isPublished: false,
            id_user: args.idUser,
            daftarSoal: [
              {
                idSoal: uuidv4().substring(0, 7),
                isWajib: 0,
                lainnya: 0,
                listJawaban: [
                  {
                    idJawaban: "jawaban-" + uuidv4().substring(0, 7),
                    jawaban: "",
                  },
                ],
                pertanyaanSoal: [{ insert: "Soal Pertanyaan\n" }],
                tipeSoal: "Pilihan Ganda",
                urlGambar: "",
                modelPertanyaan: "Model X",
              },
            ],
            daftarSoalCabang: [],
          });
        console.log("ini id baru klaik -> " + args.idForm);
        return {
          status: "success",
          data: "Survei berhasil ditambahkan",
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

    async copasData(_, args) {
      try {
        const jawabanRef = await firestore
          .collection("jawaban-survei-v3")
          .where("idUser", "==", "08b7674")
          .get();
        // let jawabanSnapshot = jawabanRef.docs.map(doc => {return{idJawaban : doc.id,...doc.data()}})
        console.log(jawabanRef.docs[0].id);
        // let batch = firestore.batch()
        // // .collection("jawaban-survei-cadangan-3")
        // for(var i in jawabanSnapshot){
        //   batch.create(firestore.collection("jawaban-survei-v3").doc(jawabanSnapshot[i].idJawaban),{
        //     daftarJawaban : jawabanSnapshot[i].daftarJawaban,
        //     daftarJawabanCabang : jawabanSnapshot[i].daftarJawabanCabang,
        //     emailPenjawab : jawabanSnapshot[i].emailPenjawab,
        //     idForm : jawabanSnapshot[i].idForm,
        //     idSurvei : jawabanSnapshot[i].idSurvei,
        //     idUser : jawabanSnapshot[i].idUser,
        //     insentif : jawabanSnapshot[i].insentif,
        //     tglPengisian : jawabanSnapshot[i].tglPengisian,
        //   })
        // }

        // await batch.commit()
        return {
          status: "success",
          data: "Data Berhasil Dicopas",
          code: 200,
        };
      } catch (e) {
        console.log(e);
        return {
          status: "fail",
          data: "Gagal ganti jawaban : " + e,
          code: 400,
        };
      }
    },
  },
};

module.exports = { publishingResolvers };
