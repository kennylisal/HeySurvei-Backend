const firebase = require("../../../db");
const firestore = firebase.firestore();
const { Timestamp, FieldValue } = require("firebase-admin/firestore");
const adminResolvers = {
  Query: {
    async cobaTanggal(_, args) {
      try {
        let awal = Timestamp.fromMillis(args.tglAwal * 1000);
        let akhir = Timestamp.fromMillis(args.tglAkhir * 1000);

        let surveiRef = await firestore
          .collection("h_survei")
          .where("tanggal_penerbitan", ">=", awal)
          .where("tanggal_penerbitan", "<=", akhir)
          .get();

        console.log(surveiRef.docs.length);
        return {
          code: 200,
          status: "success",
          data: "lihat log oi",
        };
      } catch (error) {
        return {
          code: 500,
          status: "fail",
          data: error,
        };
      }
    },
    async cobaFetch(_, args) {
      var hasil = {};
      try {
        // const response = await fetch('https://hei-survei-v1.et.r.appspot.com/api')
        // const data = await response.json();
        //
        let idTarget = [];
        // var json = { hasil: [ 'HSV - afa2df5', 'HSV - 6adc863', 'HSV - 16ba051' ] }
        // const obj = JSON.parse(JSON.stringify(json))
        // for (let index = 0; index < obj['hasil'].length; index++) {
        //   idTarget.push(obj['hasil'][index])
        // }
        // console.log(idTarget)

        // const response = await fetch('https://hei-survei-v1.et.r.appspot.com/api/search',{
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     cari : "Survei"
        //   }),
        // })
        // const data = await response.json();
        // const obj = JSON.parse(JSON.stringify(data))
        // console.log(obj['hasil'][0])
        // for (let index = 0; index < obj['hasil'].length; index++) {
        //   idTarget.push(obj['hasil'][index])
        // }
        // console.log(idTarget)

        const response = await fetch(
          "https://server-sql-dot-hei-survei-v1.et.r.appspot.com/api/push",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idSurvei: "HSV - hapus",
              namaSurvei: "Survei yang mau dihapus",
            }),
          }
        );
        const data = await response.json();

        const obj = JSON.parse(JSON.stringify(data));
        if (obj["msg"] === "berhasil") {
          console.log("ya berhasil");
        } else {
          console.log("gagal");
        }

        return {
          code: 200,
          status: "success",
          data: "lihat log oi",
        };
      } catch (error) {
        console.log(error);
        return {
          code: 400,
          status: "success",
          data: "lihat log oi",
        };
      }
    },
    async getPengajuanPencairan(_, args) {
      try {
        let pencairanRef = await firestore.collection("pencairan").get();
        let snapshot = pencairanRef.docs.map((doc) => {
          return { idPencairan: doc.id, ...doc.data() };
        });
        snapshot.forEach(function (item) {
          item.waktu_pengajuan = item.waktu_pengajuan._seconds;
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
          data: [],
        };
      }
    },
    async getPengajuanPencairanSurveyor(_, args) {
      try {
        let pencairanRef = await firestore
          .collection("pencairan-surveyor")
          .get();
        let snapshot = pencairanRef.docs.map((doc) => {
          return { idPencairan: doc.id, ...doc.data() };
        });
        snapshot.forEach(function (item) {
          item.waktu_pengajuan = item.waktu_pengajuan._seconds;
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
          data: [],
        };
      }
    },
    async getKeluhanSurvei(_, args) {
      try {
        let laporanRef = await firestore.collection("laporan_survei").get();
        let snapshot = laporanRef.docs.map((doc) => {
          return { idSurvei: doc.id, ...doc.data() };
        });
        snapshot.forEach(function (item) {
          item.tanggal = item.tanggal._seconds;
        });
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
          data: [],
        };
      }
    },
    async getOrderLaporan(_, args) {
      try {
        let awal = Timestamp.fromMillis(args.tglAwal * 1000);
        let akhir = Timestamp.fromMillis(args.tglAkhir * 1000);

        let surveiRef = await firestore
          .collection("order")
          .where("status", "==", "sukses")
          .where("tanggal", ">=", awal)
          .where("tanggal", "<=", akhir)
          .get();

        let snapshot = surveiRef.docs.map((doc) => {
          return { idOrder: doc.id, ...doc.data() };
        });
        snapshot.forEach(function (item) {
          item.tanggal = item.tanggal._seconds;
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
    async getLaporanSurvei(_, args) {
      try {
        let awal = Timestamp.fromMillis(args.tglAwal * 1000);
        let akhir = Timestamp.fromMillis(args.tglAkhir * 1000);

        let surveiRef = await firestore
          .collection("h_survei")
          .where("tanggal_penerbitan", ">=", awal)
          .where("tanggal_penerbitan", "<=", akhir)
          .get();

        let snapshot = surveiRef.docs.map((doc) => {
          return { id_survei: doc.id, ...doc.data() };
        });
        snapshot.forEach(function (item) {
          item.tanggal_penerbitan = item.tanggal_penerbitan._seconds;
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

    async getIdFormSurvei(_, args) {
      //sudah diganti
      try {
        let surveiRef = await firestore
          .collection("h_survei")
          .doc(args.idSurvei)
          .get();

        return {
          code: 200,
          status: "success",
          // idForm: dsurveiRef.data().idForm,
          idForm: surveiRef.data().idForm,
          judul: surveiRef.data().judul,
          deskripsi: surveiRef.data().deskripsi,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          idForm: "",
          judul: "",
          deskripsi: "",
        };
      }
    },

    async getPublishData(_, args) {
      try {
        let tipe = "";

        if (args.tipe == "kartu") tipe = "form-kartu";
        else tipe = "form-klasik";

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
    async getSurveiBanned(_, args) {
      try {
        let surveiRef = await firestore
          .collection("h_survei")
          .where("status", "==", "banned")
          .get();
        return {
          code: 200,
          status: "success",
          data: surveiRef.docs.length,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Terjadi kesalahan server",
          data: -1,
        };
      }
    },

    async getBerdasarkanBulan(_, args) {
      var milisBulan = [
        1704111855000, 1706790921000, 1709296605000, 1711974255000,
        1714566921000, 1717245405000, 1719923889000, 1722448800000,
      ];
      try {
        let tanggalAwal = Timestamp.fromMillis(milisBulan[args.bulan]);
        let tanggalAkhir = Timestamp.fromMillis(milisBulan[args.bulan + 1]);

        let surveiRef = firestore
          .collection("h_survei")
          .where("tanggal_penerbitan", ">=", tanggalAwal);
        surveiRef = await surveiRef
          .where("tanggal_penerbitan", "<", tanggalAkhir)
          .get();
        let hasil = 0;
        if (surveiRef.count != 0) {
          const snapshot = surveiRef.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });
          hasil = surveiRef.docs.length;
        }

        return {
          code: 200,
          status: "success",
          data: hasil,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Terjadi kesalahan server",
          data: -1,
        };
      }
    },
    async getKeuntunganHSurvei(_, args) {
      try {
        let surveiRef = await firestore.collection("h_survei").get();
        const snapshot = surveiRef.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        // console.log(snapshot[0])
        var acc = 0;
        snapshot.forEach(function akumulai(item) {
          acc += item.harga;
        });
        return {
          code: 200,
          status: "success",
          data: acc,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Terjadi kesalahan server",
          data: -1,
        };
      }
    },
    async getKeuntunganOrder(_, args) {
      try {
        let surveiRef = await firestore
          .collection("order")
          .where("status", "==", "sukses")
          .get();
        const snapshot = surveiRef.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        let acc = 0;
        for (var e in snapshot) {
          acc += Math.floor((snapshot[e].hargaTotal * 30) / 100);
        }
        // var acc = 0
        // snapshot.forEach(function akumulai(item){
        //   acc += item.harga
        // })
        return {
          code: 200,
          status: "success",
          data: acc,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Terjadi kesalahan server",
          data: -1,
        };
      }
    },
    async getUserAktif(_, args) {
      try {
        let surveiRef = await firestore.collection("Users").get();
        return {
          code: 200,
          status: "success",
          data: surveiRef.docs.length,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Terjadi kesalahan server",
          data: -1,
        };
      }
    },
    async getJumlahSurveiTerbeli(_, args) {
      try {
        let acc = 0;
        let surveiRef = await firestore
          .collection("order")
          .where("status", "==", "sukses")
          .get();
        let snapshot = surveiRef.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        for (var e in snapshot) {
          acc += snapshot[e].listSurvei.length;
        }
        return {
          code: 200,
          status: "success",
          data: acc,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Terjadi kesalahan server",
          data: -1,
        };
      }
    },
    async getJumlahTerjawab(_, args) {
      try {
        let surveiRef = await firestore.collection("jawaban-survei-v3").get();
        return {
          code: 200,
          status: "success",
          data: surveiRef.docs.length - 1,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Terjadi kesalahan server",
          data: -1,
        };
      }
    },
    async getJumlahSurveiAktif(_, args) {
      try {
        let surveiRef = await firestore
          .collection("h_survei")
          .where("status", "==", "aktif")
          .get();

        return {
          code: 200,
          status: "success",
          data: surveiRef.docs.length,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Terjadi kesalahan server",
          data: -1,
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
    async getAllUserAdmin(_, args) {
      let userRef = await firestore
        .collection("Users")
        .orderBy("waktu_pendaftaran")
        .get();
      try {
        if (userRef.empty) {
          return {
            code: 400,
            status: "data kosong",
            data: [],
          };
        } else {
          let result = userRef.docs.map((doc) => {
            return {
              idUser: doc.id,
              email: doc.data().email,
              username: doc.data().username,
              //tgl: doc.data().waktu_pendaftaran.toDate(),
              // _seconds : doc.data().waktu_pendaftaran._seconds,
              // _nanoseconds : doc.data().waktu_pendaftaran._nanoseconds,
              //tgl: "tanggal sementara",
              tgl: doc
                .data()
                .waktu_pendaftaran.toDate()
                .toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
              verified: doc.data().verified,
              isBanned: doc.data().isBanned,
            };
          });
          console.log(result);
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
  },
  Mutation: {
    async buatKategori(_, args) {
      try {
        //nama
        const kategoriRef = await firestore
          .collection("kategori")
          .doc(args.idKategori)
          .set({ nama: args.nama });
        return {
          status: "success",
          data: "Kategori berhasil ditambahkan",
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
    async hapusKategori(_, args) {
      try {
        const kategoriRef = await firestore
          .collection("kategori")
          .doc(args.idKategori)
          .delete();
        return {
          status: "success",
          data: "Kategori berhasil dihapusk",
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
    async updateKategori(_, args) {
      try {
        let kategoriRef = await firestore
          .collection("kategori")
          .doc(args.idKategori)
          .update({
            nama: args.nama,
          });

        return {
          status: "success",
          data: "Update berhasil",
          code: 200,
        };
      } catch (error) {
        return {
          status: "failed",
          data: "Server Error" + e,
          code: 500,
        };
      }
    },
    async banUser(_, args) {
      try {
        const userRef = await firestore
          .collection("Users")
          .doc(args.idUser)
          .update({
            isBanned: args.status,
          });
        return {
          status: "success",
          data: "Status user berhasil diatur",
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
    async updateReward(_, args) {
      try {
        let rewardRef = firestore
          .collection("hargaSurvei")
          .doc("rXxk9XqcSu9Rh5djur6a");
        let request = await rewardRef.update({
          hargaInsentif: args.insentif,
          hargaSurvei: args.hargaSurvei,
          hargaSpesial: args.special,
        });
        return {
          status: "success",
          data: "Update berhasil",
          code: 200,
        };
      } catch (error) {
        console.log(e);
        return {
          status: "failed",
          data: "Server Error" + e,
          code: 500,
        };
      }
    },
    async setSurveiStatus(_, args) {
      try {
        const userRef = await firestore
          .collection("h_survei")
          .doc(args.idSurvei)
          .update({
            status: args.status,
          });
        return {
          status: "success",
          data: "Status survei berhasil diatur",
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
    async ajukanPenghapusan(_, args) {
      try {
        //nama
        const pengajuanRef = await firestore
          .collection("pengajuan-penghapusan")
          .add({
            email: args.email,
            password: args.password,
            lupaPassword: args.lupa,
            pesan: args.pesan,
            tanggal_pengajuan: Timestamp.now(),
          });
        return {
          status: "success",
          data: "pengajuan berhasil dikirim",
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
    async updatePencairanSurveyor(_, args) {
      try {
        let batch = firestore.batch();

        batch.update(
          firestore.collection("pencairan-surveyor").doc(args.idPencairan),
          {
            aktif: args.status,
          }
        );
        // let pencairanRef = await firestore.collection('pencairan').doc(args.idPencairan).update({
        //   aktif : args.status,
        // })
        if (args.status === "Sukses") {
          batch.update(firestore.collection("Users").doc(args.idUser), {
            poin: FieldValue.increment(args.poin * -1),
          });
        }
        await batch.commit();
        return {
          status: "success",
          data: "Status survei berhasil diatur",
          code: 200,
        };
      } catch (error) {
        console.log(error);
        return {
          status: "failed",
          data: "Gagal Survei",
          code: 500,
        };
      }
    },
    async updatePencairan(_, args) {
      try {
        let batch = firestore.batch();

        batch.update(firestore.collection("pencairan").doc(args.idPencairan), {
          aktif: args.status,
        });
        // let pencairanRef = await firestore.collection('pencairan').doc(args.idPencairan).update({
        //   aktif : args.status,
        // })
        if (args.status === "Sukses") {
          batch.update(firestore.collection("Users-survei").doc(args.idUser), {
            poin: FieldValue.increment(args.poin * -1),
          });
        }
        await batch.commit();
        return {
          status: "success",
          data: "Status survei berhasil diatur",
          code: 200,
        };
      } catch (error) {
        console.log(error);
        return {
          status: "failed",
          data: "Gagal Survei",
          code: 500,
        };
      }
    },
  },
};

module.exports = { adminResolvers };
