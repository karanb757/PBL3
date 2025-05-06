// import React, { useCallback, useState } from 'react';
// import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
// import MarkerItem from './MarkerItem'

// const containerStyle = {
//   width: '100%',
//   height: '80vh'
// };

// const center = {
//   lat: -34.5920611,
//   lng: -58.42538589999999
// };

// function GoogleMapSection({coordinates,listing}) {
//   const { isLoaded, loadError } = useJsApiLoader({
//     id: 'google-map-script',
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY, // Replace with your actual API key
//     libraries: ['places'] // You can add additional libraries if needed
//   });

//   const [map, setMap] = useState(null);

//   const onLoad = useCallback(function callback(map) {
//     if (window.google) {
//       const bounds = new window.google.maps.LatLngBounds(center);
//       map.fitBounds(bounds);
//     }
//     setMap(map);
//   }, []);

//   const onUnmount = useCallback(function callback(map) {
//     setMap(null);
//   }, []);

//   if (!isLoaded) {
//     return <p>Loading Map...</p>;
//   }

//   if (loadError) {
//     return <p>Error loading Google Maps API: {loadError.message}</p>;
//   }

//   return (
//     <div>
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={10}
//         onLoad={onLoad}
//         onUnmount={onUnmount}
//         gestureHandling='greedy'
//       >
//         {/* You can add markers or other map elements here */}
//         {coordinates && (
//           <Marker position={coordinates} />
//         )}
//       </GoogleMap>
//     </div>
//   );
// }

// export default GoogleMapSection;

// import React, { useCallback, useState } from 'react';
// import { GoogleMap, useJsApiLoader,Marker } from '@react-google-maps/api';
// import MarkerItem from './MarkerItem';

// const containerStyle = {
//   width: '100%',
//   height: '80vh',
// };

// const center = {
//   lat: 0,
//   lng: 0,
// };

// const zoom = 1; 

// function GoogleMapSection({ coordinates, listing }) {
//   const { isLoaded, loadError } = useJsApiLoader({
//     id: 'google-map-script',
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY,
//     libraries: ['places'],
//   });

//   const [map, setMap] = useState(null);

//   const onLoad = useCallback((map) => {
//     if (window.google) {
//       const bounds = new window.google.maps.LatLngBounds(center);
//       map.fitBounds(bounds);
//     }
//     setMap(map);
//   }, []);

//   const onUnmount = useCallback(() => {
//     setMap(null);
//   }, []);

//   if (!isLoaded) return <p>Loading Map...</p>;
//   if (loadError) return <p>Error loading Google Maps API: {loadError.message}</p>;

//   return (
//     <div>
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={10}
//         onLoad={onLoad}
//         onUnmount={onUnmount}
//         gestureHandling='greedy'
//       >
//         {listing?.map((item, index) => (
//           <MarkerItem key={index} item={item} />
//         ))}
//         {coordinates && <Marker position={coordinates} />}
//       </GoogleMap>
//     </div>
//   );
// }

// export default GoogleMapSection;

import React, { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import MarkerItem from './MarkerItem';

const containerStyle = {
  width: '100%',
  height: '80vh',
};

function GoogleMapSection({ coordinates, listing }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY,
    libraries: ['places'],
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback((map) => {
    if (window.google) {
      const bounds = new window.google.maps.LatLngBounds();

      // Extend bounds for each marker from listing
      if (listing?.length) {
        listing.forEach((item) => {
          const lat = parseFloat(item.latitude);
          const lng = parseFloat(item.longitude);
      
          if (!isNaN(lat) && !isNaN(lng)) {
            bounds.extend({ lat, lng });
          }
        });
      }

      // Extend bounds for a single selected coordinate if available
      if (coordinates) {
        bounds.extend(coordinates);
      }

      // Fit bounds if we added at least one point
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
      } else {
        // Default view if no coordinates available
        map.setCenter({ lat: 20, lng: 0 });
        map.setZoom(2);
      }
    }

    setMap(map);
  }, [listing, coordinates]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) return <p>Loading Map...</p>;
  if (loadError) return <p>Error loading Google Maps API: {loadError.message}</p>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={onLoad}
        onUnmount={onUnmount}
        gestureHandling='greedy'
      >
        {listing?.map((item, index) => (
          <MarkerItem key={index} item={item} />
        ))}
        {coordinates && <Marker position={coordinates} />}
      </GoogleMap>
    </div>
  );
}

export default GoogleMapSection;


