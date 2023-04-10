const mongoose = require("mongoose");
const validator = require("validator");

const User  = mongoose.model("User",{
    nom:{
        type:String
    },

    prenom:{
        type:String
    },

    email:{
        type:String,
        required:true,
        unique:true,
        validate(v){
            if(!validator.isEmail(v)) throw new Error();
        }
      
      
    },
    
    password:{
        type:String,
        required:true
    },

    AuthTokens:{
        type:String
    },

    adresses: {
        type: [String],
        default: []
    }
});


module.exports = User;