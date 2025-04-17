var map = L.map('map').setView([21.7679,78.8718],10)
	  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		  maxZoom: 19,
		  attribution: '&copy; OpenStreetMap contributors'
		}).addTo(map);
		function randomPopulation() {
          return Math.floor(Math.random() * 50000000) + 1000000;
          }
         const dummyPopulations = {};
    	 const stateNames = [];
        function populateSidebar(names) {
		  document.getElementById('total-states').textContent = names.length;

        const randomStates = [...names].sort(() => 0.5 - Math.random()).slice(0, 5);
        const list = document.getElementById('random-states');
        list.innerHTML = '';

        randomStates.forEach(name => {
          const li = document.createElement('li');
          li.className = 'state-item';
          li.textContent = `${name} - Population: ${dummyPopulations[name].toLocaleString()}`;
          list.appendChild(li);
        });
    }
		const stateColors = {
         "Andaman and Nicobar": "#f28f3b",
         "Andhra Pradesh": "#66c2a5",
 		 "Arunachal Pradesh": "#fc8d62",
		 "Assam": "#8da0cb",
		 "Bihar": "#e78ac3",
		 "Chandigarh": "#ffd92f",
		 "Chhattisgarh": "#a6d854",
		 "Dadra and Nagar Haveli": "#e5c494",
		 "Daman and Diu": "#b3b3b3",
		 "Delhi": "#1f78b4",
		 "Goa": "#33a02c",
		 "Gujarat": "#fb9a99",
		 "Haryana": "#e31a1c",
		 "Himachal Pradesh": "#fdbf6f",
		 "Jammu and Kashmir": "#cab2d6",
		 "Jharkhand": "#6a3d9a",
		 "Karnataka": "#ffff99",
		 "Kerala": "#b15928",
		 "Ladakh": "#8dd3c7",
		 "Lakshadweep": "#ffffb3",
		 "Madhya Pradesh": "#bebada",
		 "Maharashtra": "#fb8072",
		 "Manipur": "#80b1d3",
		 "Meghalaya": "#fdb462",
		 "Mizoram": "#b3de69",
		 "Nagaland": "#fccde5",
		 "Odisha": "#d9d9d9",
		 "Puducherry": "#bc80bd",
		 "Punjab": "#ccebc5",
		 "Rajasthan": "#ffed6f",
	     "Sikkim": "#ffb3b3",
	     "Tamil Nadu": "#b0e0e6",
	     "Telangana": "#dda0dd",
		 "Tripura": "#deb887",
		 "Uttar Pradesh": "#cd5c5c",
		 "Uttarakhand": "#5f9ea0",
		 "West Bengal": "#d8bfd8"
		};
		function indiastyle(feature) {
		 return {
           fillColor: stateColors[feature.properties.NAME_1] || "#cccccc",
           weight: 1,
           opacity: 1,
           color: 'black',
           dashArray: '3',
           fillOpacity: 0.5
         };
        }
       function onEachState(feature,layer){
		   if(feature.properties && feature.properties.NAME_1){
			   layer.bindPopup(`<strong>${feature.properties.NAME_1}</strong>`);
		   }
       }
	fetch("Indian_States.geojson")
  	.then(response => response.json())
  	.then(india => {
         india.features.forEach(feature => {
          const name = feature.properties.NAME_1;
          if (!dummyPopulations[name]) {
            dummyPopulations[name] = randomPopulation();
            stateNames.push(name);
      }
    });

    let currentHighlight;
    function highlightFeature(layer) {
      if (currentHighlight) {
         maplayer.resetStyle(currentHighlight);
      }
      layer.setStyle({
        weight: 3,
        color: 'blue',
        fillOpacity: 0.9
      });
      currentHighlight = layer;
    }

    function searchState() {
      const query = document.getElementById('stateSearch').value.trim().toLowerCase();
      if (!query) return;
      let found = false;

      maplayer.eachLayer(layer => {
        const stateName = layer.feature.properties.NAME_1;
        if (stateName.toLowerCase() === query) {
          highlightFeature(layer);
          map.fitBounds(layer.getBounds());
          document.getElementById('state-name').textContent = stateName;
          document.getElementById('state-pop').textContent = dummyPopulations[stateName].toLocaleString();
          found = true;
        }
      });

      if (!found) {
        alert("State not found!");
      }
    }

    const maplayer = L.geoJson(india, {
      style: indiastyle,
      onEachFeature: function(feature, layer) {
        onEachState(feature, layer);
        layer.on('click', function () {
           layer.openPopup();;
          document.getElementById('state-name').textContent = feature.properties.NAME_1;
          document.getElementById('state-pop').textContent = dummyPopulations[feature.properties.NAME_1].toLocaleString();
        });
      }
    }).addTo(map);

    map.fitBounds(maplayer.getBounds());
    populateSidebar(stateNames);

    // Attach search function to global scope
    window.searchState = searchState;
  });
