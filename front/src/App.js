import {GoogleMap, useLoadScript,MarkerF,InfoWindowF} from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import axios from "axios";



const Taille = {

  width:"1500px",
  height:"1000px"
}

export default function App() {

  const [data,setdata] = useState([]);  
  const [selectedMarkers,setSelectedMarkers] = useState(null);
  
  useEffect(()=>{
    const fetchData = async () => {
      const result = await axios("http://localhost:3030/liste");
      setdata(result.data);
    }
    fetchData();
  },[])

  const {isLoaded} = useLoadScript({
    googleMapsApiKey:"cle api maps"
  }) 

  if(!isLoaded){
    return <div>Chargement....</div>;
  }

  return (
   <div>
    <GoogleMap zoom={12} center={{lat:48.866667,lng:2.333333}} mapContainerStyle={Taille}>
        {data.map(element=> {
          let pos = {
            lat:element.latitude,
            lng:element.longitude
          }
          return (<MarkerF key={element.stationId} position={pos} onClick = {()=>{setSelectedMarkers(element)}}/>)
        })}
          {selectedMarkers && <InfoWindowF position={{lat:selectedMarkers.latitude,lng:selectedMarkers.longitude}}> 
              <p>{"Nom : " + selectedMarkers.nom}<br></br> {"Velo disponible : " + selectedMarkers.veloDisponible}</p>
          </InfoWindowF>}
    </GoogleMap>
   </div>
  );
}


