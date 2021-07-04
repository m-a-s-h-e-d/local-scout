import React, { useRef, useEffect, useState, memo } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import pin from "./images/mapbox-icon.png";

function Pins(props) {
  const { data, onClick } = props;
  console.log("why isnt this wokring")
  // this mapping of Pins is infinite and constantly firing
  return ([] || data[0]).map((location) => (
    // need to geocode the proper values now.
    
    <Marker
      key={location._id}
      longitude={location.fields.geom.coordinates[0]}
      latitude={location.fields.geom.coordinates[1]}
      onClick={() => onClick(location)}
    >
      {pin}
    </Marker>
  ));
}

export default memo(Pins);
