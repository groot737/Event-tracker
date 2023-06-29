
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

// modify leaflet map style
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      attribution: 'Map tiles by <a href="https://carto.com/attribution">Carto</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Data by <a href="http://www.openstreetmap.org/">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC BY SA</a>.'
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