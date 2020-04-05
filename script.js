// votre code JS

let mymap = L.map('map').setView([ 48.8566, 2.3522 ], 13);
let url = '';

L.mapbox.accessToken =
	'pk.eyJ1IjoiY2FwaXRhaW5vYnZpb3VzIiwiYSI6ImNrOG4xaTRwNDBpZ2EzZW9jaW9lcjBwc24ifQ.CwtLwM9_UkbFAYyp0cMAYw';

mymap.addLayer(L.mapbox.styleLayer('mapbox://styles/capitainobvious/ck8n3281g284h1ilbru9rxctq'));

var markerIcon = L.icon({
	iconUrl: 'marker.png',
	// shadowUrl: 'leaf-shadow.png',

	iconSize: [ 25, 40 ], // size of the icon
	// shadowSize:   [50, 64], // size of the shadow
	iconAnchor: [ 22, 94 ], // point of the icon which will correspond to marker's location
	// shadowAnchor: [4, 62],  // the same for the shadow
	popupAnchor: [ -3, -76 ] // point from which the popup should open relative to the iconAnchor
});

let layerMarkers = L.layerGroup().addTo(mymap);

async function getData(query) {
	layerMarkers.clearLayers();

	if (query) {
		url =
			'https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=date_start+%3E%3D+%23now()+AND+date_start+%3C+%23now(months%3D1) ' +
			query +
			'&rows=50&facet=category&facet=tags&facet=address_zipcode&facet=address_city&facet=pmr&facet=blind&facet=deaf&facet=access_type&facet=price_type';
	}

	if (!query) {
		url =
			'https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=date_start+%3E%3D+%23now()+AND+date_start+%3C+%23now(months%3D1)&rows=50&facet=category&facet=tags&facet=address_zipcode&facet=address_city&facet=pmr&facet=blind&facet=deaf&facet=access_type&facet=price_type';
	}

	let response = await fetch(url);
	let data = await response.json();

	data.records.forEach(function(event) {
		let title = event.fields.title;
		let date = event.fields.date_start.replace('T', ' ');
		date = date.slice(0, 16);
		let descirption = event.fields.description;
		let adresse = event.fields.address_street;
		let prix = event.fields.price_type.charAt(0).toUpperCase() + event.fields.price_type.substring(1);
		let prix_detail = '';
		if (event.fields.price_detail) {
			prix_detail = ' - ' + event.fields.price_detail;
		}

		if (!event.fields.lat_lon) {
			return;
		}

		let latitude = event.fields.lat_lon[0];
		let longitude = event.fields.lat_lon[1];

		let marker = L.marker([ latitude, longitude ], { icon: markerIcon }).addTo(layerMarkers);
		marker.bindPopup(
			'<span class="title">' +
				title +
				'</span><br><br><span class="date">' +
				date +
				' - ' +
				adresse +
				'</span><br><br><span class="prix">' +
				prix +
				' ' +
				prix_detail +
				'</span><br><br><span class="description">' +
				descirption,
			{
				maxHeight: '300'
			}
		);
	});
}

getData();

function onFormSubmit(event) {
	event.preventDefault();

	getData(searchInput.value);
}
