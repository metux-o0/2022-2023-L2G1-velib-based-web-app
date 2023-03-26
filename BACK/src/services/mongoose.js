const mongoose = require("mongoose");

async function Connectdb(){
    await mongoose.connect("mongodb+srv://NOmUtilisateur:mdp@test.ppkdbye.mongodb.net/?retryWrites=true&w=majority");
    console.log("DB Connecté");
}

module.exports = {
    Connectdb
}