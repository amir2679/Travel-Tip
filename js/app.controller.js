import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onSearchLocation = onSearchLocation
window.onGo = onGo
window.onRemoveLocation = onRemoveLocation


function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))

    locService.getLocs().then(renderLocations)

}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            onPanTo(pos.coords)
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}


function onPanTo({ longitude, latitude }) {
    console.log('Panning the Map')
    mapService.panTo(latitude, longitude)
}


function onSearchLocation(ev) {
    ev.preventDefault()
    const locationName = document.querySelector('.search-input').value
    locService.searchLocation(locationName)
        .then(mapService.panTo)
    locService.getLocs().then(renderLocations)
    // .catch(error => console.log(error))
}

function renderLocations(locs) {

    var strHtmls = locs
        .map(({ name, lat, lng }) => {
            return `<tr>
            <td>${name}</td>
            <td> <button class="btn go" onclick="onGo('${lat}','${lng}')">Go</button></td>
            <td><button class="btn delete" onclick="onRemoveLocation('${lat, lng}')">Delete</button></td>
        </tr>`
        })
        .join('')
    document.querySelector('.locations-table').innerHTML = strHtmls
}

function onGo(lat, lng) {
    mapService.panTo(lat, lng)
}

function onRemoveLocation(lat, lng) {
    locService.removeLocation(lat, lng)
    locService.getLocs().then(renderLocations)
}
