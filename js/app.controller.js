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
window.onCopyLink = onCopyLink


function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
            locService.getLocs().then(renderLocations)
            renderByQueryStringParams()
            })
        .catch(() => console.log('Error: cannot init map'))
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
    // mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
    locService.getCurrLocation().then(mapService.addMarker)
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
}

function renderLocations(locs) {

    var strHtmls = locs
        .map(({ name, lat, lng, id }) => {
            return `<tr>
            <td>${name}</td>
            <td> <button class="btn go" onclick="onGo(${lat} , ${lng})">Go</button></td>
            <td><button class="btn delete" onclick="onRemoveLocation('${id}')">Delete</button></td>
        </tr>
        `
        })
        .join('')


    document.querySelector('.locations-table').innerHTML = strHtmls
}

function onGo(lat, lng) {
    console.log(lat, lng)
    mapService.panTo(lat, lng)
    locService.setCurrLocation(lat, lng)
    // setQueryParams()
}

function onRemoveLocation(id) {
    locService.removeLocation(id)
    locService.getLocs().then(renderLocations)
}


function onCopyLink() {
    locService.getCurrLocation().then(({ lat, lng }) => {
        const queryStringParams = `?lat=${lat}&lng=${lng}`
        const newUrl = 'https://amir2679.github.io/Travel-Tip/' + queryStringParams
        console.log(newUrl)
        return newUrl
    })
        .catch(console.log)
}

function renderByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)

    const lat = +queryStringParams.get('lat')
    const lng = +queryStringParams.get('lng')
    console.log(lat, lng)

    if (!lat || !lng) return
    locService.setCurrLocation(lat, lng)
    mapService.panTo(lat, lng)
}