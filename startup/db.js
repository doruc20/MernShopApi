const mongoose = require("mongoose");
const logger = require("./logger");
const config = require("config");

const username = config.get("db.username");
const password = config.get("db.password");
const database = config.get("db.database");

module.exports = function() {
    mongoose
        .connect(`mongodb+srv://${username}:${password}@cluster0.kfjfak2.mongodb.net/${database}?retryWrites=true&w=majority`)
        .then(() => logger.info("mongodb bağlantısı kuruldu."))
}