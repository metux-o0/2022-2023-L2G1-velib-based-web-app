const express = require("express");
const app = express();
const axios = require("axios");
const geo = require("geolib");
const body = require("body-parser");
const { Connectdb } = require("./src/services/mongoose");
const User = require("./src/models/user");
const crypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authentification = require("./src/middlewares/authentification");
const Stations = require("./src/models/stations");

app.use(express.json());



app.listen(3030, async () => {

    if (await Stations.count({}) == 0) {
        let listeFinal = new Array();
        let listeStations = await axios.get("https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_status.json", axiosOptions);
        let listeCoord = await axios.get("https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_information.json", axiosOptions);

        ((((listeStations.data).data).stations).map(async (element) => {
            for (let i = 0; i < ((listeStations.data).data.stations).length; i++) {
                if (element.station_id === (((listeCoord.data).data).stations)[i].station_id) {
                    let stations = new Stations({
                        stationId: element.station_id,
                        nom: (((listeCoord.data).data).stations)[i].name,
                        veloDisponible: element.num_bikes_available,
                        velo_Mecanique: element.num_bikes_available_types[0].mechanical,
                        velo_electrique: element.num_bikes_available_types[1].ebike,
                        latitude: (((listeCoord.data).data).stations)[i].lat,
                        longitude: (((listeCoord.data).data).stations)[i].lon,
                        stationCode: element.stationCode,
                        PlaceDisponible: element.num_docks_available,
                        capacite: (((listeCoord.data).data).stations)[i].capacity

                    });
                    stations._id = element.station_id;
                    await stations.save();
                }
            }
        }))
        await Stations.find({});
    } else {
        let listeStations = await axios.get("https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_status.json", axiosOptions);
        for (let i = 0; i < listeStations.data.data.stations.length; i++) {
            let stations = await Stations.findByIdAndUpdate(listeStations.data.data.stations[i].station_id, {
                "veloDisponible": listeStations.data.data.stations[i].num_bikes_available,
                "velo_Mecanique": listeStations.data.data.stations[i].num_bikes_available_types[0].mechanical,
                "velo_electrique": listeStations.data.data.stations[i].num_bikes_available_types[1].ebike,
                "PlaceDisponible": listeStations.data.data.stations[i].num_docks_available
            }, {
                new: true
            });

        }
        console.log("ici");

    }
    console.log(await Stations.count({}));
    console.log("Tout est bon");
});

Connectdb();

const axiosOptions = {
    headers: {
        "X-Riot-Token": process.env.RIOTKEY
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

app.get("/", (req, res) => {
    res.sendFile("./index.html", { root: __dirname });

})

app.get("/liste",async (req, res) => {
    const stations = await Stations.find({});
    res.send(stations);

})

app.get("/liste/elec", async (req, res) => {
    const stations = await Stations.find({
        velo_electrique: { $gte: 1 }
    });
    res.send(stations);
});

app.get("/prochesElectrique/:lat/:long",async (req,res) => {
    let listeFinale = await Stations.find({
        velo_electrique: {$gte: 2}
    });

    listeFinale.sort((a, b) => {
        let PosUser = {
            latitude: req.params.lat,
            longitude: req.params.long
        }

        return (geo.getDistance(PosUser, { latitude: a.latitude, longitude: a.longitude }) - geo.getDistance(PosUser, { latitude: b.latitude, longitude: b.longitude }))
    })
    res.send(listeFinale.slice(0, 10));
});

app.get("/prochesMechanique/:lat/:long",async (req,res) => {
    let listeFinale = await Stations.find({
        velo_Mecanique: {$gte: 2}
    });

    listeFinale.sort((a, b) => {
        let PosUser = {
            latitude: req.params.lat,
            longitude: req.params.long
        }

        return (geo.getDistance(PosUser, { latitude: a.latitude, longitude: a.longitude }) - geo.getDistance(PosUser, { latitude: b.latitude, longitude: b.longitude }))
    })
    res.send(listeFinale.slice(0, 10));
});



app.get("/proches/:lat/:long", async (req, res) => {
    let listeFinale = await Stations.find({
        veloDisponible: {$gte: 2}
    });

    listeFinale.sort((a, b) => {
        let PosUser = {
            latitude: req.params.lat,
            longitude: req.params.long
        }

        return (geo.getDistance(PosUser, { latitude: a.latitude, longitude: a.longitude }) - geo.getDistance(PosUser, { latitude: b.latitude, longitude: b.longitude }))
    })
    res.send(listeFinale.slice(0, 10));

});

app.get("/prochesStationsDeposer/:lat/:long", async (req, res) => {
    const listeFinale = await Stations.find({
        PlaceDisponible: { $gte: 2 }
    });

    listeFinale.sort((a, b) => {
        let PosUser = {
            latitude: req.params.lat,
            longitude: req.params.long
        }

        return (geo.getDistance(PosUser, { latitude: a.latitude, longitude: a.longitude }) - geo.getDistance(PosUser, { latitude: b.latitude, longitude: b.longitude }))
    })
    res.send(listeFinale.slice(0, 10));

});

app.get("/prochesStationsDeposerBonusVide/:lat/:long", async (req, res) => {
    const listeFinale = await Stations.find({
        veloDisponible: { $lt: 1 }
    });

    listeFinale.sort((a, b) => {
        let PosUser = {
            latitude: req.params.lat,
            longitude: req.params.long
        }

        return (geo.getDistance(PosUser, { latitude: a.latitude, longitude: a.longitude }) - geo.getDistance(PosUser, { latitude: b.latitude, longitude: b.longitude }))
    })
    res.send(listeFinale.slice(0, 10));

});

//========================================================================================
//========================================================================================
//========================================================================================
//========================================================================================


app.post("/users/register", async (req, res, next) => {

    crypt.hash(req.body.password, 8, async (err, hash) => {
        try {
            req.body.password = hash;
            const user = new User({
                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                password: req.body.password
            });
            const saveUser = await user.save();
            res.send(saveUser);
        } catch (e) {
            res.status(401).json({ message: "Nous n'avons pas pu créer le compte en raison d'un possible conflit avec des informations d'identification existantes ou d'une autre erreur. Veuillez réessayer avec d'autres informations" });
        }
    });

});


app.post("/users/addresses", async (req, res) => {
    const { userId, address } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { adresses: address } },
            { new: true }
        );
        res.send(user.adresses);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur lors de l'ajout de l'adresse" });
    }
});


app.post("/users/login", async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        crypt.compare(req.body.password, user.password, async (err, result) => {
            if (result) {
                var token = jwt.sign({ _id: user._id }, "foo");
                user.AuthTokens = token;
                await user.save();
                res.send({ user: { prenom: user.prenom, nom: user.nom, id: user._id }, token });
            } else {
                res.status(400).json({ message: "Mauvais mot de passe" });
            }
        });
    } catch (e) {
        res.status(404).json({ message: "Not found: Compte n'existe pas, veuillez en créer un " });
    }
});

app.post("/users/logout", authentification, async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user._id, AuthTokens: req.user.AuthTokens });
        user.AuthTokens = "";
        await user.save();
        //console.log(user);
        res.status(204).send(); // pour dire déconnexion réussie
    } catch (e) {
        res.status(500).json({ message: "Une erreur interne s'est produite sur le serveur." });
    }
});



app.get("/users", async (req, res, next) => {

    const user = await User.find({});
    if (!user) {
        res.send("Aucun Utilisateur");
    }
    res.send(user);
});

app.get("/users/me", authentification, async (req, res, next) => {
    try {
        res.json(req.user);
    } catch (e) {
        res.status(401).json({ message: "Unauthorized" });
    }
});

app.get("/users/:id", async (req, res, next) => {
    const idC = req.params.id;
    try {
        const user = await User.findById(idC);
        //console.log(user);
        res.send(user);
    } catch (e) {
        console.log("Erreur");
        res.send(e);
    }
});

app.patch("/users/:id", async (req, res, next) => {
    const idC = req.params.id;
    const { nom, prenom, password } = req.body;
    crypt.hash(password, 8, async (err, hash) => {
      try {
        const updatedUser = await User.findByIdAndUpdate(idC, {
          nom,
          prenom,
          password: hash,
        }, {
          new: true,
        });
        res.send(updatedUser);
      } catch (e) {
        res.status(500).send({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
      }
    });
  });

app.delete("/users/:id",authentification ,async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "Utilisateur introuvable" });
        }
        res.send({ message: "Le compte a été supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur lors de la suppression de l'utilisateur" });
    }
});

app.patch('/users/:id/clearAddresses', async (req, res, next) => {
    const idC = req.params.id;
    const { adresses } = req.body;
    try {
      const updatedUser = await User.findByIdAndUpdate(idC, { adresses }, { new: true });
      res.send(updatedUser);
    } catch (error) {
      res.status(500).send({ message: 'Erreur lors de la suppression des adresses' });
    }
  });


/*
1 app.post("/users/register", ...): pour enregistrer un nouvel utilisateur dans la base de données.
2 app.post("/users/login", ...): pour permettre à un utilisateur existant de se connecter et générer un token d'authentification.
3 app.post("/users/logout", ...): pour déconnecter un utilisateur et supprimer son token d'authentification.
4 app.get("/users", ...): pour récupérer tous les utilisateurs enregistrés dans la base de données.
5 app.get("/users/me", ...): pour récupérer les informations de l'utilisateur actuellement connecté à partir de son token d'authentification.
6 app.get("/users/:id", ...): pour récupérer les informations d'un utilisateur spécifiqu depuis son ID.
7 app.patch("/users/:id", ...): pour mettre à jour les informations d'un utilisateur à partir de son ID.
8 app.delete("/users/:id", ...): pour supprimer un utilisateur depuis son ID. 
9 app.patch('/users/:id/clearAdresses...: pour effacer l'historique d'adresses
*/