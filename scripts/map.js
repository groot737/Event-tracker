
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

    iconSize: [16, 16],
    iconAnchor: [16, 16],
})

// modify leaflet map style
var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

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