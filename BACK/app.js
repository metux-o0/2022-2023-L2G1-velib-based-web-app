const express = require("express");
const app = express();
const axios = require("axios");
const geo =  require("geolib");
const body = require("body-parser");
const { Connectdb } = require("./src/services/mongoose");
const  User = require("./src/models/user");
const crypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authentification = require("./src/middlewares/authentification");

app.use(express.json());

app.listen(3030, ()=>{
    console.log("server Back is on port 3030")
});

Connectdb();

const axiosOptions = {
    headers:{
        "X-Riot-Token":process.env.RIOTKEY
    }
}

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

app.get("/",(req,res) => {
    res.sendFile("./index.html",{root: __dirname});
    
})

app.get("/liste",async (req,res) => {
    let listeFinal = new Array();
    let listeStations = await axios.get("https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_status.json",axiosOptions);
    let listeCoord = await axios.get("https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_information.json",axiosOptions);

    ((((listeStations.data).data).stations).map(element => {
        for(let i =0;i<((listeStations.data).data.stations).length;i++){
            if(element.station_id === (((listeCoord.data).data).stations)[i].station_id){
  
                listeFinal.push({
                    stationId : element.station_id,
                    nom : (((listeCoord.data).data).stations)[i].name,
                    veloDisponible : element.num_bikes_available,
                    velo_Mecanique: element.num_bikes_available_types[0].mechanical,
                    velo_electrique: element.num_bikes_available_types[1].ebike,
                    latitude : (((listeCoord.data).data).stations)[i].lat,
                    longitude : (((listeCoord.data).data).stations)[i].lon
                });
            }
        }
    }))
    res.send(listeFinal);
    
})

app.get("/proches/:lat/:long",async (req,res) => {
    let listeFinale = new Array();
    let listeStationss = await axios.get("https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_status.json",axiosOptions);
    let listeCoordd = await axios.get("https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_information.json",axiosOptions);
    
    ((((listeStationss.data).data).stations).map(element => {
        for(let i =0;i<((listeStationss.data).data.stations).length;i++){
            if(element.station_id === (((listeCoordd.data).data).stations)[i].station_id){
                
<<<<<<< HEAD
                if (element.num_bikes_available > 0) {
                    listeFinale.push({
                        stationId : element.station_id,
                        nom : (((listeCoordd.data).data).stations)[i].name,
                        veloDisponible : element.num_bikes_available,
                        velo_Mecanique: element.num_bikes_available_types[0].mechanical,
                        velo_electrique: element.num_bikes_available_types[1].ebike,
                        latitude : (((listeCoordd.data).data).stations)[i].lat,
                        longitude : (((listeCoordd.data).data).stations)[i].lon
                    });
                }
=======
                listeFinale.push({
                    stationId : element.station_id,
                    nom : (((listeCoordd.data).data).stations)[i].name,
                    veloDisponible : element.num_bikes_available,
                    velo_Mecanique: element.num_bikes_available_types[0].mechanical,
                    velo_electrique: element.num_bikes_available_types[1].ebike,
                    latitude : (((listeCoordd.data).data).stations)[i].lat,
                    longitude : (((listeCoordd.data).data).stations)[i].lon,
                    stationCode : element.stationCode
                });
>>>>>>> b8ad3e61c27836455e3d7c18c99d0acdb27ec062
            }
        }
    }))
    
    listeFinale.sort((a,b) => {
        let PosUser = {
            latitude:req.params.lat,
            longitude:req.params.long
        }
        
        return (geo.getDistance(PosUser,{latitude:a.latitude,longitude:a.longitude}) - geo.getDistance(PosUser,{latitude:b.latitude,longitude:b.longitude}))
    })
    res.send(listeFinale.slice(0,10));

});

app.post("/users/register",async(req,res,next) => {
        
    crypt.hash(req.body.password,8,async (err,hash) => {
        try{
        req.body.password = hash;
        const user = new User(req.body);
        const saveUser = await user.save();
        res.send(saveUser);
        }catch(e){
            res.send("Erreur");
        }
    });

});


app.post("/users/login",async (req,res,next) => {
    try{    
    const user = await User.findOne({email:req.body.email});
    crypt.compare(req.body.password,user.password,async (err,result) => {
    if(result){
        var token = jwt.sign({_id : user._id},"foo");
        user.AuthTokens = token;
        await user.save();
        res.send({user,token});
    }else{
        res.send("Mauvais mdp");
    }    
});}catch(e){
    res.send("Erreur");
}
});

app.post("/users/logout",authentification,async (req,res,next) => {
    try{
        const user = await User.findOne({_id:req.user._id,AuthTokens:req.user.AuthTokens});
        user.AuthTokens = "";
        await user.save();
        res.send("Deconnecter");
    }catch(e){
        res.send("Erreur");
    }
});



app.get("/users",async (req,res,next) => {

const user = await User.find({});
if(!user){
    res.send("Aucun Utilisateur");
}
res.send(user);
});

app.get("/users/me",authentification,async (req,res,next) => {
res.send(req.user);
});

app.get("/users/:id",async (req,res,next) => {
const idC = req.params.id;
try{
    const user = await User.findById(idC);
    console.log(user);
    res.send(user);
}catch(e){
    console.log("Erreur"); 
    res.send(e);
}
});

app.patch("/users/:id" , async (req,res,next) => {
const idC = req.params.id
crypt.hash(req.body.password,8,async (err,hash) => {
    try{
        req.body.password = hash;
        const user = await User.findByIdAndUpdate(idC,req.body,{
            new:true
        });
        console.log(user);
        res.send(user);
        }catch(e){
            res.send(e);
        }
});
});

app.delete("/users/:id",async (req,res,next) => {

try{
    const user = await User.findByIdAndDelete(req.params.id);
    res.send(user);
    }catch(e){
        res.send(e);
    }

});