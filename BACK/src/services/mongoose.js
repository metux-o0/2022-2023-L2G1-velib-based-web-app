const MongoDBLink = require("./MongoDBlink");

const mongoose = require("mongoose");

async function Connectdb(){
    await mongoose.connect(MongoDBLink);
    console.log("DB Connecté");
}

module.exports = {
    Connectdb
} 