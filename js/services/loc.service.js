import { utilService } from './storage.service.js';

export const locService = {
    getLocs,
    searchLocation,
    removeLocation
}

let gLocs

const STORAGE_KEY = 'locationsDB'
_createLocs()

// let gLocationsCache = utilService.load(STORAGE_KEY)

function _createLocs() {
    let locs = utilService.load(STORAGE_KEY)
    if (!locs || !locs.length) {
        locs = [
            { name: 'Greatplace', lat: 31.047104, lng: 34.832384 },
            { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
        ]
    }

    gLocs = locs
    utilService.save(STORAGE_KEY, locs)
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs)
        }, 2000)
    })
}

function addLocation() {

}

function searchLocation(locaionName) {
    const location = gLocs.find(loc => loc.name === locaionName)
    if (location) {
        console.log('from cache');
        return Promise.resolve(location)
    }

    let locationStr = ''
    locaionName.split(' ').forEach(word => {
        locationStr += `${word}+`
    })
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationStr}&key=AIzaSyB4KkxoOeE5v372OVETOUkUmfhZi9hW0cY`
    return axios.get(url).then(({ data }) => {
        const searchedLoc = {
            name: data.results[0].address_components[0].short_name,
            id: data.results[0].place_id,
            lat: data.results[0].geometry.location.lat,
            lng: data.results[0].geometry.location.lng
        }
        console.log(gLocs)
        gLocs.push(searchedLoc)
        console.log(gLocs)
        utilService.save(STORAGE_KEY, gLocs)

        return data.results[0].geometry.location
    })
}

function removeLocation(lat ,lng) {
    let idx = gLocs.findIndex((loc) => { loc.lat === lat &&  loc.lng === lng})
    gLocs.splice(idx, 1)
}



