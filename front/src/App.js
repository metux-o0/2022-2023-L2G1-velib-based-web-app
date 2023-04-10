import { GoogleMap, useLoadScript, Marker, InfoWindow, Autocomplete, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import { useState, useEffect } from 'react';
import axios from "axios";
import Modal from "react-modal";
import './components/page/Map/styleMap.css'

Modal.setAppElement('#root');

const Taille = {
  width: "100vw",
  height: "100vh",
};

const libraries = ["places", "geometry"];




const image = {
  url: "./images/pin_station.png",
  scaledSize: {
    width: 15,
    height: 15
  }
};

const emptyImage = {
  url: "./images/pin_station_vide.png",
  scaledSize: {
    width: 15,
    height: 15
  }
};


const myLocationImage = {
  url: "./images/myPosition.png",
  scaledSize: {
    width: 50,
    height: 50
  }
};

const NearsBikes = {
  url: "./images/pin_station_proche.svg",
  scaledSize: {
    width: 50,
    height: 50
  },
};

const modalStyle = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#6DD5B3",
  },
};









export default function App() {

  //=================================================================================================================
  //=================================================================================================================
  //=================================================================================================================
  // states , états - données ---------------------------------------------------------------------------------------
  const [data, setData] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markersVisible, setMarkersVisible] = useState(false);
  const [emptyMarkersVisible, setEmptyMarkersVisible] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);

  const [center, setCenter] = useState({ lat: 48.866667, lng: 2.333333 });

  const [nearStations, setNearStations] = useState([]);
  const [directionsButton] = useState(true);
  const [directions, setDirections] = useState(null);
  const [nearStationsVisible, setNearStationsVisible] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [enteredLocation, setEnteredLocation] = useState(null);
  const [userLocation, setUserLocation] = useState({ // pour gerer les GPS de l'utilisateur
    loaded: false,
    coordonnees: { lat: "", lng: "" },
  });

  const [screenErrorMessage, setScreenErrorMessage] = useState(false);

  const [isModalOpenFindDeposit, setIsModalOpenFindDeposit] = useState(false);
  const [searchOptionFindDeposit, setSearchOptionFindDeposit] = useState(null);
  const [isModalDisplayed, setIsModalDisplayed] = useState(false);

  const [isModalOpenMechaElec, setIsModalOpenMechaElec] = useState(false);
  const [searchOptionMechaElec, setSearchOptionMechaElec] = useState(null);

  const [isModalOpenDepositEmpty, setIsModalOpenDepositEmpty,] = useState(false);
  const [searchOptionDepositEmpty, setSearchOptionDepositEmpty] = useState(null);






  //==================================================================================================================
  //=================================================================================================================
  //=================================================================================================================
  // Hook , Fonctions - Comportements -------------------------------------------------------------------------------
  useEffect(() => {
    const onSuccess = (location) => {
      setUserLocation({
        loaded: true,
        coordonnees: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
      });
    };

    const onError = (error) => {
      setUserLocation({
        loaded: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    };

    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation n'est pas supporté dans votre navigateur !",
      });
    }

    navigator.geolocation.watchPosition(onSuccess, onError);
  }, []);



  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://localhost:3030/liste" ,{headers: {
        "Authorization": "bearer " + localStorage.getItem("token"),
    }});
      setData(result.data);
    };
    fetchData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      let decidedLocation = null;

      if (enteredLocation !== null) { // si on a saisi une adresse
        decidedLocation = enteredLocation;
      } else if (userLocation.loaded) { // si la géolocalisation est activée
        decidedLocation = userLocation.coordonnees;
      }

      if (decidedLocation !== null && searchOptionFindDeposit === "trouver") {
        const result = await axios.get(`http://localhost:3030/proches/${decidedLocation.lat}/${decidedLocation.lng}`);
        setNearStations(result.data);
      }
      if (decidedLocation !== null && searchOptionFindDeposit === "deposer") {
        const result = await axios.get(`http://localhost:3030/prochesStationsDeposer/${decidedLocation.lat}/${decidedLocation.lng}`);
        setNearStations(result.data);
      }
      if (decidedLocation !== null && searchOptionFindDeposit === "trouver" && searchOptionMechaElec === "mechanique") {
        const result = await axios.get(`http://localhost:3030/prochesMechanique/${decidedLocation.lat}/${decidedLocation.lng}`);
        setNearStations(result.data);
      }
      if (decidedLocation !== null && searchOptionFindDeposit === "trouver" && searchOptionMechaElec === "electrique") {
        const result = await axios.get(`http://localhost:3030/prochesElectrique/${decidedLocation.lat}/${decidedLocation.lng}`);
        setNearStations(result.data);
      }

      if (decidedLocation !== null && searchOptionFindDeposit === "deposer" && searchOptionDepositEmpty === "vide") {
        const result = await axios.get(`http://localhost:3030/prochesStationsDeposerBonusVide/${decidedLocation.lat}/${decidedLocation.lng}`);
        setNearStations(result.data);
      }
    };

    fetchData();
  }, [enteredLocation, userLocation, searchOptionFindDeposit, searchOptionMechaElec, searchOptionDepositEmpty]);



  const toggleMarkers = () => {
    setMarkersVisible((prevVisible) => !prevVisible);
  };

  const toggleEmptyMarkers = () => {
    setEmptyMarkersVisible((prevVisible) => !prevVisible);
  };

  const toggleNearStations = () => {
    setNearStationsVisible((prevVisible) => !prevVisible);
  };

  const handlePlaceSelect = async () => {

    if (autocomplete) { //pour vérifier que l'objet autocomplete existe avant d'appeler sa méthode getPlace()
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setEnteredLocation({
          lat,
          lng
        });
        setCenter({ lat, lng }); // mettre à jour les coordonnées du state 'center' de la carte en fonction de l'adresse saisie
        setSearchOptionFindDeposit(null);
        setIsModalOpenFindDeposit(true);
      }
    }
  };

  const handleUserSearchOption = () => {
    if (userLocation.loaded && userLocation.coordonnees
      && userLocation.coordonnees.lat !== "" && userLocation.coordonnees.lng !== "") {
      if (!isModalDisplayed) { // on rentre dans cette condition seulement si l'affichage de choix 'trouver'/'déposer' n'est jamais fait
        setIsModalDisplayed(true);// donc il a été affiché au moins une seule fois
        setIsModalOpenFindDeposit(true);
      }
      return (userLocation.loaded && userLocation.coordonnees
        && userLocation.coordonnees.lat !== "" && userLocation.coordonnees.lng !== "");
      //renvoie true car l'affichage de l'icone de l'utilisateur est sous condition d'avoir son GPS validé
    }
    return false;
  };


  function closeModal() {
    setIsModalOpenFindDeposit(false);
    setIsModalOpenMechaElec(false);
    setIsModalOpenDepositEmpty(false);
  }

  function handleFind() {
    setSearchOptionFindDeposit("trouver");
    setIsModalOpenFindDeposit(false);
    setIsModalOpenMechaElec(true);
  }

  function handleDeposit() {
    setSearchOptionFindDeposit("deposer");
    setIsModalOpenFindDeposit(false);
    setIsModalOpenDepositEmpty(true);
  }

  function handleFindMechanic() {
    setSearchOptionMechaElec("mechanique");
    setIsModalOpenMechaElec(false);
  }

  function handleFindElectric() {
    setSearchOptionMechaElec("electrique");
    setIsModalOpenMechaElec(false);
  }

  function handleDepositEmpty() {
    setSearchOptionDepositEmpty("vide");
    setIsModalOpenDepositEmpty(false);
  }

  function GoBackFindDeposit() {
    setIsModalOpenDepositEmpty(false);
    setIsModalOpenMechaElec(false);
    setIsModalOpenFindDeposit(true);
  }



  const calculateDirections = async (destination) => {
    const DirectionsService = new window.google.maps.DirectionsService();

    let origin;
    if (enteredLocation) {
      origin = new window.google.maps.LatLng(
        enteredLocation.lat,
        enteredLocation.lng
      );
    } else {
      origin = new window.google.maps.LatLng(
        userLocation.coordonnees.lat,
        userLocation.coordonnees.lng
      );
    }

    const destinationLatLng = new window.google.maps.LatLng(
      destination.latitude,
      destination.longitude
    );

    DirectionsService.route(
      {
        origin: origin,
        destination: destinationLatLng,
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log("result", result);
          setDirections(result);
          const distance = result.routes[0].legs[0].distance.text;
          const duration = result.routes[0].legs[0].duration.text;
          setRouteInfo({ distance, duration });
          console.log("directions", directions);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };












  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "Google Map API Key",
    libraries: libraries,
  });

  if (!isLoaded) return "loading maps";
  if (loadError) return "Error loading maps";


  const showStationInfo = (station) => {
    setSelectedMarker(station);
  };


  //===========================================================================================================
  //===========================================================================================================
  //===========================================================================================================
  return (  // rendering -------------------------------------------------------------------------------------
    <div
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <GoogleMap
        zoom={14}
        center={center}
        mapContainerStyle={Taille}
        options={{
          disableDefaultUI: true,
        }}
      >
        <div
          style={{
            position: "absolute",
            marginTop: 20,
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Autocomplete
            onLoad={(autocomplete) => setAutocomplete(autocomplete)}
            onPlaceChanged={handlePlaceSelect}
          >
            <input type="text" placeholder="Rechercher une adresse" />
          </Autocomplete>

          <Modal
            isOpen={isModalOpenFindDeposit}
            onRequestClose={closeModal}
            style={modalStyle}
          >
            <h2>Que voulez vous faire ?</h2>
            <br></br>
            <p>Cliquez sur Echap ou autour pour fermer le menu</p>
            <br></br>
            <button className="btn-map" onClick={handleFind} style={{ backgroundColor: "#55a042" }}>Trouver un vélo</button>
            <button className="btn-map" onClick={handleDeposit} style={{ backgroundColor: "#55a042" }}>Déposer un vélo</button>
          </Modal>

          <Modal
            isOpen={isModalOpenMechaElec}
            onRequestClose={closeModal}
            style={modalStyle}
          >
            <h2>Quel(s) type(s) de vélo cherchez-vous ?</h2>
            <br></br>
            <p>Cliquez sur Echap ou autour pour fermer le menu</p>
            <p>Si vous fermez ce menu, cela affichera automatiquement les stations vélos les plus proches avec les 2 types de vélo</p>
            <br></br>
            <button className="btn-map" onClick={handleFindMechanic} style={{ backgroundColor: "#88cd36" }}> Vélo(s) méchanique(s)</button>
            <button className="btn-map" onClick={handleFindElectric} style={{ backgroundColor: "#67bfc3" }}> Vélo(s) électrique(s) </button>
            <button className="btn-map" onClick={closeModal} style={{ backgroundColor: "#4FEC47" }}> Les 2 types </button>
            <button className="btn-map" onClick={GoBackFindDeposit} style={{ backgroundColor: "#269CB7" }}> Retourner en arrière </button>
          </Modal>

          <Modal
            isOpen={isModalOpenDepositEmpty}
            onRequestClose={closeModal}
            style={modalStyle}
          >
            <h2>Quelle est votre préférence pour déposer votre vélo ?</h2>
            <br></br>
            <p>Cliquez sur Echap ou autour pour fermer le menu</p>
            <p style={{ color: 'red' }}>Sur certaines applications, lorsque vous déposez un vélo dans une station vide, vous gagnez des bonus.</p>
            <p>Si vous fermez ce menu, cela affichera automatiquement les stations vélos avec au moins deux places disponibles !</p>
            <br></br>
            <button className="btn-map" onClick={handleDepositEmpty} style={{ backgroundColor: "#4FEC47" }}> BONUS : Station(s) vide(s) </button>
            <button className="btn-map" onClick={closeModal} style={{ backgroundColor: "#4FEC47" }}> Pas de préférence </button>
            <button className="btn-map" onClick={GoBackFindDeposit} style={{ backgroundColor: "#269CB7" }}> Retourner en arrière </button>
          </Modal>


          <div>
            {/*gestion de rendering de Location (soit affichage avec succès soit non en cas d'erreur avec message)*/}
            {handleUserSearchOption() && (
              <MarkerF //Problème il fallait utiliser MarkerF et pas Marker
                position={{
                  lat: userLocation.coordonnees.lat,
                  lng: userLocation.coordonnees.lng,
                }}
                icon={myLocationImage}
              />
            )}
            {userLocation.error && !screenErrorMessage && (
              <div className='sreenErrorGPS'>
                <p>Erreur: {userLocation.error.message}</p>
                <p>Vous avez refusé de partager vos info GPS, cliquez sur "OK" sachant que vous pouvez
                  utiliser la barre de recherche d'adresse afin d'obtenir use liste des staions
                </p>
                <button className="btn-map" onClick={() => setScreenErrorMessage(true)}>
                  OK
                </button>
              </div>
            )}
          </div>




          {searchOptionFindDeposit !== null && ( // pour afficher les vélos proches d'une localisation il faut choisir une option
            <div>
              {nearStations.map((elementNearStation, index) => {
                let pos = {
                  lat: elementNearStation.latitude,
                  lng: elementNearStation.longitude,
                };
                let myIcon = NearsBikes;
                return (
                  <Marker
                    key={index}
                    position={pos}
                    icon={myIcon}
                    onClick={() => {
                      calculateDirections(elementNearStation);
                    }}
                    onDblClick={() => {
                      showStationInfo(elementNearStation);
                    }}
                  />
                );
              })}
            </div>
          )}


        </div>

        <div style={{ position: "absolute", top: 10, left: 1 }}>
          <button className="btn-map" onClick={toggleMarkers}>
            {markersVisible ? "Cacher Les Stations" : "Montrer Les Stations"}
          </button>
          <br></br>
          <button className="btn-map" onClick={toggleEmptyMarkers}>
            {emptyMarkersVisible
              ? "Cacher Les Stations Vides"
              : "Montrer Les Stations Vides"}
          </button>
          <br></br>
          {directions && (
            <button className="btn-map" onClick={() => {
              setDirections(null);
            }}>
              {"Supprimer le chemin tracé"}
            </button>
          )}
          <br></br>
          {nearStations.length > 0 && searchOptionFindDeposit !== null && (
            <button className="btn-map" onClick={toggleNearStations}>
              {nearStationsVisible
                ? "Cacher les stations proches"
                : "Stations les plus proches"}
            </button>
          )}


          {nearStationsVisible && (
            <ul className="station-list">
              {nearStations.map((station, index) => (
                <li key={index} onClick={() => calculateDirections(station)}>
                  <div className="bike-icon"></div>
                  <div className="station-name">{station.nom}</div>
                  <div className="available-bikes">{station.veloDisponible} vélo(s) disponible(s)</div>
                </li>
              ))}
            </ul>

          )}
        </div>


        {data.map((element, index) => {
          let pos = {
            lat: element.latitude,
            lng: element.longitude,
          };

          let icon = image;
          if (element.veloDisponible === 0) {
            icon = emptyImage;
          }

          if (markersVisible && element.veloDisponible !== 0) {
            return (
              <Marker
                key={index}
                position={pos}
                onClick={() => {
                  showStationInfo(element);

                }}
                visible={true}
                icon={icon}
              />
            );
          }

          if (emptyMarkersVisible && element.veloDisponible === 0) {
            return (
              <Marker
                key={index}
                position={pos}
                onClick={() => {
                  showStationInfo(element);

                }}
                visible={true}
                icon={icon}
              />
            );
          }
          return null;

        })}

        {enteredLocation && (
          <MarkerF
            position={{ lat: enteredLocation.lat, lng: enteredLocation.lng }}
          />
        )}

        {selectedMarker && (
          <InfoWindow
            position={{
              lat: selectedMarker.latitude,
              lng: selectedMarker.longitude,
            }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="info-window">
              <h4>{"Nom : " + selectedMarker.nom}</h4>
              <p>{"Code de la station : " + selectedMarker.stationCode}</p>
              <p>{"Velo(s) disponible(s) : " + selectedMarker.veloDisponible}</p>
              <p>{"Vélo(s) mécanique(s) : " + selectedMarker.velo_Mecanique}</p>
              <p>{"Vélo(s) éléctrique(s) : " + selectedMarker.velo_electrique}</p>
              <p>{"Capacité :" + selectedMarker.capacite}</p>
            </div>
          </InfoWindow>

        )}

        {selectedMarker && (
          <div className='info-box'>
            <div>
              <h4>{selectedMarker.nom}</h4>
              <p>Code de la station : {selectedMarker.stationCode}</p>
              <p>Vélos électriques : {selectedMarker.velo_electrique}</p>
              <p>Vélos mécaniques : {selectedMarker.velo_Mecanique}</p>
              <p>Capacité : {selectedMarker.capacite} vélo(s)</p>
            </div>
          </div>
        )}


        {directions && (
          <>
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: "rgb(0, 183, 104)",
                  strokeWeight: 6,
                },
              }}
              panel={directionsButton ? document.getElementById("directions-panel") : null} //Amine ???
            />
            {routeInfo && (
              <div className="route-info-box">
                <h4>Informations trajet :</h4>
                <p>Distance : {routeInfo.distance}</p>
                <p>Temps de trajet : {routeInfo.duration}</p>
                <p>Clic-double sur le pin pour plus d'info</p>
              </div>
            )}
          </>
        )}
      </GoogleMap>
    </div>
  )
};