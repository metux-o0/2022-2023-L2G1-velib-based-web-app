import { GoogleMap, useLoadScript, Marker, InfoWindow, Autocomplete, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import { useState, useEffect } from 'react';
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement('#root');

const Taille = {
  width: "100vw",
  height: "100vh",
};


const libraries = ["places"];

const controlStyle = {
  backgroundColor: "#fff",
  border: "2px solid #fff",
  borderRadius: "3px",
  boxShadow: "0 2px 6px rgba(0,0,0,.3)",
  cursor: "pointer",
  margin: "10px",
  padding: "0 10px",
};


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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchOption, setSearchOption] = useState(null);






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
      const result = await axios("http://localhost:3030/liste");
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

      if (decidedLocation !== null) {
        const result = await axios.get(`http://localhost:3030/proches/${decidedLocation.lat}/${decidedLocation.lng}`);
        setNearStations(result.data);
      }
    };

    fetchData();
  }, [enteredLocation, userLocation]);


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
        setIsModalOpen(true);
      }
    }
  };


  function closeModal() {
    setIsModalOpen(false);
  }

  function handleFind() {
    setSearchOption("trouver");
    setIsModalOpen(false);
  }

  function handleDeposit() {
    setSearchOption("deposer");
    setIsModalOpen(false);
    window.alert("En cours de construction...");
  }



  const calculateDirections = async (destination) => { //Problème à gérer, lors de la première itinéraire calculer, la valeur de la vairbale "directions" est à null
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
          setDirections(result);
          const distance = result.routes[0].legs[0].distance.text;
          const duration = result.routes[0].legs[0].duration.text;
          setRouteInfo({ distance, duration });
          console.log(directions); // c'est ici que le problème se passe dans la console (lors du premier chemin calculé)
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "Clef Api GooGle",
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
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            style={modalStyle}
          >
            <h2>Que voulez vous faire ?</h2>
            <button onClick={handleFind}>Trouver un vélo</button>
            <button onClick={handleDeposit}>Déposer un vélo</button>
          </Modal>


          <div>
            {/*gestion de rendering de userLocation (soit affichage avec succès soit non en cas d'erreur avec message)*/}
            {userLocation.loaded && userLocation.coordonnees && userLocation.coordonnees.lat !== "" && userLocation.coordonnees.lng !== "" && (
              <MarkerF //Problème il fallait utiliser MarkerF et pas Marker
                position={{
                  lat: userLocation.coordonnees.lat,
                  lng: userLocation.coordonnees.lng,
                }}
                icon={myLocationImage}
              />
            )}
            {userLocation.error && !screenErrorMessage && (
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#6AD3B1",
                  padding: "20px",
                  borderRadius: "5px",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
                  fontFamily: "Verdana"
                }}
              >
                <p>Erreur: {userLocation.error.message}</p>
                <p>Vous avez refusé de partager vos info GPS, cliquez sur "OK" sachant que vous pouvez
                  utiliser la barre de recherche d'adresse afin d'obtenir use liste des staions
                </p>
                <button style={{ ...controlStyle, color: "navy" }} onClick={() => setScreenErrorMessage(true)}>OK</button>
              </div>
            )}
          </div>


          {searchOption === "trouver" && ( // pour afficher les vélos proches d'une localisation il faut choisir "trouver" 
            <div>
              {nearStations.map((elementNearStation) => {
                let pos = {
                  lat: elementNearStation.latitude,
                  lng: elementNearStation.longitude,
                };
                let myIcon = NearsBikes;
                return (
                  <Marker
                    key={elementNearStation.stationId}
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
          <button style={controlStyle} onClick={toggleMarkers}>
            {markersVisible ? "Cacher Les Stations" : "Montrer Les Stations"}
          </button>
          <br></br>
          <button style={controlStyle} onClick={toggleEmptyMarkers}>
            {emptyMarkersVisible
              ? "Cacher Les Stations Vides"
              : "Montrer Les Stations Vides"}
          </button>
          <br></br>
        </div>
        {nearStations.length > 0 && searchOption === "trouver" && (
          <div style={{ position: "absolute", top: 10, left: 210 }}>
            <button style={controlStyle} onClick={toggleNearStations}>
              {nearStationsVisible
                ? "Cacher les stations proches"
                : "Stations les plus proches"}
            </button>


            {nearStationsVisible && (
              <ul style={{ backgroundColor: "rgb(0, 224, 185)" }}>
                {nearStations.map((station, index) => (
                  <li
                    key={index}
                    style={{ cursor: "pointer" }}
                    onClick={() => calculateDirections(station)}
                  >
                    {station.nom} : {station.veloDisponible} vélo(s) disponible(s)
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}


        {data.map((element) => {
          let pos = {
            lat: element.latitude,
            lng: element.longitude,
          };

          let icon = image;
          if (element.veloDisponible === 0) {
            icon = emptyImage;
          }

          return (
            <Marker
              key={element.stationId}
              position={pos}
              onClick={() => {
                showStationInfo(element);

              }}
              visible={
                markersVisible &&
                (element.veloDisponible > 0 || emptyMarkersVisible)
              }
              icon={icon}
            />
          );
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
          // Réinitialiser le state selectedMarker lorsque l'info-bulle est fermée car sinon la première station 
          // sur laquelle on a cliqué dessus reste toujours dans selectedMarker


          >
            <p>
              {"Nom : " + selectedMarker.nom}
              <br />
              {"Code de la station :" + selectedMarker.stationCode}
              <br />
              {"Velo(s) disponible(s) : " + selectedMarker.veloDisponible}
              <br />
              {"vélo(s) mécanique(s) : " + selectedMarker.velo_Mecanique}
              <br />
              {"vélo(s) éléctrique(s) : " + selectedMarker.velo_electrique}
              <br />
              {"Capacité :" + selectedMarker.capacite}

            </p>
          </InfoWindow>
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
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "rgb(0, 183, 104)",
                  padding: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,.3)",
                  borderRadius: "10px",
                  zIndex: "1000",
                  fontFamily: "Verdana"
                }}
              >
                <p>Distance : {routeInfo.distance}</p>
                <p>Temps de trajet : {routeInfo.duration}</p>
                <p style={{
                  fontSize: "0.6em",
                  color: "navy",
                  boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.1",

                }}>
                  Clic-double sur le pin pour plus d'info
                </p>
              </div>
            )}
          </>
        )}
      </GoogleMap>
    </div>
  )
};