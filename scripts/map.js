
// create leaflet map
var map = L.map('map', {
    detectRetina: true
}).setView([1, 1], 2);

var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
let span = document.getElementsByTagName('span');
let spanArr = [span[0], span[1], span[2]]
let title = document.getElementById('exampleModalLabel')
let currentUrl = window.location.href
let disaster = currentUrl.slice(currentUrl.indexOf('=') + 1)

// create icon
let greenIcon = L.icon({
    iconUrl: `./images/icons/${disaster}.png`,

    iconSize: [24, 24],
    iconAnchor: [24, 24],
})

// modify leaflet map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

var satelliteLayer = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=YOUR_MAPBOX_ACCESS_TOKEN', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
});

var baseMaps = {
    'Satellite': satelliteLayer,
    'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    })
};

var baseMaps = {
    'Satellite': satelliteLayer,
    'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    })
};

// fetch coordinates then display on map
async function logJSONData() {

    const response = await fetch(`https://eonet.gsfc.nasa.gov/api/v3/events?category=${disaster}`);
    const jsonData = await response.json();

    if (jsonData['events'].length > 0) {

        for (let i = 0; i < jsonData['events'].length; i++) {

            let coordinates = jsonData['events'][i]['geometry'][0]['coordinates']
            let magnitudeValue = jsonData['events'][i]['geometry'][0]['magnitudeValue']
            let magnitudeUnit = jsonData['events'][i]['geometry'][0]['magnitudeUnit']
            spanArr[2].innerText = jsonData['events'][i]['geometry'][0]['date']
            let marker = L.marker([coordinates[1], coordinates[0]], { icon: greenIcon }).addTo(map)

            // add click function to the marker
            marker.on('click', () => {
                title.innerText = jsonData['events'][i]['title']
                if (magnitudeUnit != null && magnitudeValue != null) {

                    spanArr[0].innerText = magnitudeValue
                    spanArr[1].innerText = magnitudeUnit

                } else {

                    spanArr[0].innerText = 'unvailable'
                    spanArr[1].innerText = 'unvailable'

                }
                myModal.show()
            })
        }

    } else {
        // warn user if events not found
        title.innerText = 'Data is currently unavailable.'
        document.getElementById('body').style.display = 'none'
        myModal.show()
    }

}
logJSONData()
