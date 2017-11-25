import Fetcher from '../helpers/Fetcher'
import TokenService from '../services/TokenService'
import { API_URL_JMO_TRACKS, API_URL_JMO_ALBUMS, API_URL_JMO_PLAYLISTS, API_URL_FRIENDS } from '../constants'

class MusicService {
    constructor() {
        this.fetcher = new Fetcher()
    }

    getTracks = (offset, limit, query) => {
        const search = query !== undefined && query !== null ? `&namesearch=${query.split(' ').join('+')}`: ''
        return this.fetcher.getWithAuth(`${API_URL_JMO_TRACKS}?offset=${offset}&limit=${limit}${search}`)
    }

    getAlbums = (offset, limit, query) => {
        const search = query !== undefined && query !== null ? `&namesearch=${query.split(' ').join('+')}`: ''
        return this.fetcher.getWithAuth(`${API_URL_JMO_ALBUMS}?offset=${offset}&limit=${limit}${search}`)
    }

    getTracksFromAlbum = (albumId) => {
        return this.fetcher.getWithAuth(`${API_URL_JMO_ALBUMS}/${albumId}`)
    }

    getPlaylists = (offset, limit, query) =>{
        const search = query !== undefined && query !== null ? `&namesearch=${query.split(' ').join('+')}`: ''
        return this.fetcher.getWithAuth(`${API_URL_JMO_PLAYLISTS}?offset=${offset}&limit=${limit}${search}`)
    }
}

// exportamos un singleton...
//export default new MusicService()
export default MusicService