import { GoogleMap, useLoadScript, Marker, InfoWindow , Autocomplete, MarkerF, DirectionsRenderer} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import axios from "axios";

const Taille = {
  width: "100vw",
  height: "100vh",
};

const controlStyle = {
  backgroundColor: "#fff",
  border: "2px solid #fff",
  borderRadius: "3px",
  boxShadow: "0 2px 6px rgba(0,0,0,.3)",
  cursor: "pointer",
  margin: "10px",
  padding: "0 10px",
};

const center = {
  lat: 48.866667,
  lng: 2.333333,
};

const image = {
  url: "./pin_station.png",
  scaledSize: {
    width: 15,
    height: 15
  }
};

const emptyImage = {
  url: "./pin_station_vide.png",
  scaledSize: {
    width: 15,
    height: 15
  }
};

const myLocation = {
  lat: 48.8867937,
  lng: 2.3544721
};

const myLocationImage = {
  url: "./myPosition.png",
  scaledSize: {
    width: 50,
    height: 50
  }};

  const NearsBikes = {
    url: "./stations_proches.svg",
    scaledSize: {
      width: 50,
      height: 50
    },
  };
  










export default function App() {


  // states , états - données ---------------------------------------------------------------------------------------
  const [data, setData] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markersVisible, setMarkersVisible] = useState(false);
  const [emptyMarkersVisible, setEmptyMarkersVisible] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [myLocation, setMyLocation] = useState(null);
  const [nearStations,setNearStations] = useState([]);
  const [directionsButton] = useState(true);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://localhost:3030/liste");
      setData(result.data);
    };
    fetchData();
  }, []);

  useEffect (() => {

    
    const fetchData = async () =>{
      const result = await axios.get(`http://localhost:3030/proches/${myLocation.lat}/${myLocation.lng}`);
      setNearStations(result.data)
    }

    fetchData();
  }, []);

  const toggleMarkers = () => {
    setMarkersVisible((prevVisible) => !prevVisible);
  };

  const toggleEmptyMarkers = () => {
    setEmptyMarkersVisible((prevVisible) => !prevVisible);
  };

  const handlePlaceSelect = async () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setMyLocation({
        lat,
        lng
      });

      center.lat = lat;
      center.lng = lng;

      try {
        await axios.post("http://localhost:3030/location", {
          latitude: center.lat,
          longitude: center.lng,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };




  const calculateDirections = async () => {
  
    const service = new window.google.maps.DirectionsService();
  
    const origin = new window.google.maps.LatLng(
      myLocation.lat,
      myLocation.lng
    );
  
    const destination = new window.google.maps.LatLng(
      nearStations[0].latitude,
      nearStations[0].longitude
    );
  
    service.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.BICYCLING,
      },
      (result, status) => {
  
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "Clef API google",
    libraries: ["places"],
  });

  if (!isLoaded) return "loading maps";
  if (loadError) return "Error loading maps";
  








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
          {nearStations.map((elementNearStation) => {
            let pos = {
              lat: elementNearStation.latitude,
              lng: elementNearStation.longitude,
            };
  
            let myIcon = NearsBikes;
  
            return <MarkerF position={pos} icon={myIcon} />;
          })}
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
          {nearStations.length > 0 && (
          <>
            <br/>
            <button
              style={controlStyle}
              onClick={calculateDirections}
            >Station la plus proche</button>
          </>
  )}
        </div>
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
                setSelectedMarker(element);
                
              }}
              visible={
                markersVisible &&
                (element.veloDisponible > 0 || emptyMarkersVisible)
              }
              icon={icon}
            />
          );
        })}
  
        {myLocation && (
          <MarkerF
            position={{ lat: myLocation.lat, lng: myLocation.lng }}
            icon={myLocationImage}
          />
        )}
  
        {selectedMarker && (
          <InfoWindow
            position={{
              lat: selectedMarker.latitude,
              lng: selectedMarker.longitude,
            }}
          >
            <p>
              {"Nom : " + selectedMarker.nom}
              <br />
              {"Velo(s) disponible(s) : " + selectedMarker.veloDisponible}
              <br />
              {"vélo(s) mécanique(s) : " + selectedMarker.velo_Mecanique}
              <br />
              {"vélo(s) éléctrique(s) : " + selectedMarker.velo_electrique}
              <br />
              {"Identifiant de la station :" + selectedMarker.stationId}
            </p>
          </InfoWindow>
        )}
  
  {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} panel={directionsButton ? document.getElementById("directions-panel") : null} />}
      </GoogleMap>
    </div>
  )};