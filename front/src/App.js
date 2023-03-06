import { GoogleMap, useLoadScript, Marker, InfoWindow , Autocomplete } from "@react-google-maps/api";
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

export default function App() {
  const [data, setData] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markersVisible, setMarkersVisible] = useState(false);
  const [emptyMarkersVisible, setEmptyMarkersVisible] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://localhost:3030/liste");
      setData(result.data);
    };
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
      center.lat = place.geometry.location.lat();
      center.lng = place.geometry.location.lng();
  
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

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "Clef APi",
    libraries: ["places"],
  });

  if (!isLoaded) return "loading maps";
  if (loadError) return "Error loading maps";
  
  return (
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
        </div>
  
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <button style={controlStyle} onClick={toggleMarkers}>
            {markersVisible ? "Cacher Les Stations" 
            : "Montrer Les Stations"}
          </button>
          <button style={controlStyle} onClick={toggleEmptyMarkers}>
            {emptyMarkersVisible
              ? "Cacher Les Stations Vides"
              : "Montrer Les Stations Vides"}
          </button>
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
              onClick={() => setSelectedMarker(element)}
              visible={markersVisible && (element.veloDisponible > 0 || emptyMarkersVisible)}
              icon={icon}
            />
          );
        })}
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
              <br/>
              {"vélo(s) mécanique(s) : " + selectedMarker.velo_Mecanique}
              <br/>
              {"vélo(s) éléctrique(s) : " + selectedMarker.velo_electrique}
              <br/>
              {"Identifiant de la station :" + selectedMarker.stationId}
            </p>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
  }