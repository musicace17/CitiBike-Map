let newYorkCoords = [40.73, -74.0059];
let mapZoomLevel = 12;
let url = "https://gbfs.citibikenyc.com/gbfs/en/station_information.json"

// Create the createMap function.
function createMap(bikeStations) {

  // Create the tile layer that will be the background of our map.
    let lightmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

  // Create a baseMaps object to hold the lightmap layer.
    let baseMaps = {
        "lightmap": lightmap
    };

  // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps = {
        "Bike Stations": bikeStations
    };

  // Create the map object with options.
  let myMap = L.map("map-id", {
    center : newYorkCoords,
    zoom: mapZoomLevel,
    layers: [lightmap, bikeStations]
});
  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}
// Create the createMarkers function.
function createMarkers(response) {
  // Pull the "stations" property from response.data.
    let stations = response;
  // Initialize an array to hold the bike markers.
    let bikeMarkers = [];
  // Loop through the stations array.
    // For each station, create a marker, and bind a popup with the station's name.
    for (let i = 0; i < response.length; i++) {
        let station = stations[i];
        // Grab lat and lon from the station
        let lat = station.lat;
        let lon = station.lon;
        // Make a marker (with a popup)
        let marker = L.marker([lat, lon]).bindPopup(station.name)
    // Add the marker to the bikeMarkers array.
        bikeMarkers.push(marker);
    }
  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    let layerGroup = L.layerGroup(bikeMarkers);
    createMap(layerGroup);
}
// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json(url).then(function(rawData){
    // console.log(rawData.data.stations);
    createMarkers(rawData.data.stations);
})