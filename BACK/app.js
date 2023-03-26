const express = require("express");
const app = express();
const axios = require("axios");
const geo =  require("geolib");
const body = require("body-parser");

app.listen(3030, ()=>{
    console.log("server Back is on port 3030")
});

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