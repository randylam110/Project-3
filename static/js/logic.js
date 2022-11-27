const chargingStations = 'ev-stations';



function mapStations() {  
  d3.json(chargingStations).then(function(data) {
    console.log("map stations",data);

    let stations = data.data;


    // define tile layers.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
    });

    // Initialize all the LayerGroups that we'll use
    let layers = {
      TYPE_1: new L.markerClusterGroup(),
      TYPE_2: new L.markerClusterGroup(),
      DC_FAST: new L.markerClusterGroup()
    };
  
    // Create the map with layers
    let map = L.map("map", {
      center: [40.73, -118.0059],
      zoom: 5,
      maxZoom: 18,
      layers: [
        layers.TYPE_1,
        layers.TYPE_2,
        layers.DC_FAST
      ]
    });

    // Add our "streetmap" tile layer to the map.
    streetmap.addTo(map);
  
    // Create an overlays object to add to the layer control.
    let overlays = {
      //"EV Level 1 Chargers": layers.TYPE_1,
      "EV Level 2 Chargers": layers.TYPE_2,
      "EV DC Fast Chargers": layers.DC_FAST
    };

    // Create a control for our layers, and add our overlays to it.
    L.control.layers(null, overlays).addTo(map);
    // Arrays that will store the created charging station Markers by charging type
    let chargerType;

    // Create a new marker cluster group.
    //let newMarker = L.markerClusterGroup();

    for (let i = 0; i < stations.length; i++) {
      // loop through the data array, create a new marker, and push it to the appropriate layer (note a station may have more than one type)
      let location = [stations[i][9],stations[i][10]];

      if(stations[i][7]>0){
        chargerType = 'DC_FAST';
        
      } else if(stations[i][6]>0){
        chargerType = 'TYPE_2';
       
      } else if(stations[i][5]>0){
        chargerType = 'TYPE_1';
        
      }
      // Create a new marker with the appropriate icon and coordinates.
      let newMarker = L.marker(location).bindPopup("<b>" + stations[i][0] + " " + chargerType + "</b><br>" + stations[i][1] + "<br>" + stations[i][2] + ", " + stations[i][3] + "<br>" + stations[i][4]);

      // Add the new marker to the appropriate layer.
      newMarker.addTo(layers[chargerType]);
    }    
  });
}

mapStations();