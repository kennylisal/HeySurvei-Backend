const admin = require("firebase-admin");

const credentials = require("./creds.json");

const db = admin.initializeApp({
    credential:admin.credential.cert(credentials),
    databaseURL: "https://hei-survei-v1-default-rtdb.asia-southeast1.firebasedatabase.app"
});

module.exports = db;