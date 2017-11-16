const GENRES = ['Alternative Rock', 'Ambient', 'Classical', 'Country', 'EDM',
    'Dancehall', 'Deep House', 'Disco', 'Drum & Bass', 'Dubstep', 'Electronic',
    'Folk', 'Singer-Songwriter', 'Rap', 'House', 'Indie', 'Jazz & Blues',
    'Latin', 'Metal', 'Piano', 'Pop', 'R&B & Soul', 'Reggae', 'Reggaeton',
    'Rock', 'Soundtrack', 'Techno', 'Trance', 'Trap', 'Triphop']

const API_KEY = '8dacb3c2a9b8ff4016fab4a76df1441c'
const URL = 'https://api.flickr.com/services/rest/'
const QUERY = `?method=flickr.photos.search&format=json&nojsoncallback=true&api_key=${API_KEY}&license=1&safe_search=1&content_type=1&text=`
// Flickr image sizes: https://www.flickr.com/services/api/misc.urls.html

// usage: Flickr(genre).then(uri => ...)
export default Flickr = function (search) {
    if (!search) {
        const random = Math.floor(Math.random() * GENRES.length)
        search = `${GENRES[random]} music`
    }

    return fetch(`${URL}${QUERY}${search}`)
        .then(res => res.json())
        .then(json => {
            const random = Math.round(Math.random() * json.photos.photo.length)
            if (json.stat !== 'ok' || !json.photos || !json.photos.photo || json.photos.photo.length === 0)
                throw new Error('no photos returned.')

            const { id, secret, farm, server } = json.photos.photo[random]
            return (`https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_n.jpg`) // antes el tamaño era _m
        })
}