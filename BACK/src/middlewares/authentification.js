const jwt = require("jsonwebtoken");
const User = require("../models/user");


const authentification =  async(req,res,next) => {
    try{
        const authToken = req.header("Authorization").replace("bearer ","");
        const decodeToken = jwt.verify(authToken,"foo");
        const user = await User.findOne({_id:decodeToken._id,AuthTokens:authToken});

        if(!user) throw new Error();
        req.user = user;  
        next()
    }catch(e){
        res.send("Veuillez vous identifier");
    }
}


module.exports = authentification;