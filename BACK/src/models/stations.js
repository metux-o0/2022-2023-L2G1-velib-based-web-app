const mongoose = require("mongoose");

const Stations = mongoose.model("stations",{

    _id:{
        type:Number
    },

    nom:{
        type:String,
        
    },

    veloDisponible:{
        type:Number,
        
    },

    velo_Mecanique:{
        type:Number,
        
    },

    velo_electrique:{
        type:Number,
        
    },

    latitude:{
        type:Number,
        
    },

    longitude:{
        type:Number,
        
    },

    stationCode:{
        type:String,
        
    },

    capacite:{
        type:Number
    },

    PlaceDisponible:{
        type:Number
    }

});

module.exports = Stations;
