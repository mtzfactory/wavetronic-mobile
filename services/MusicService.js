import Fetcher from './Fetcher'
import { API_URL_TRACKS, API_URL_ALBUMS, API_URL_PLAYLISTS, API_URL_FRIENDS } from '../constants'

class MusicService extends Fetcher {
    getTracks = (offset, limit) => {
        return this.__get(`${API_URL_TRACKS}?offset=${offset}&limit=${limit}`)
    }

    getAlbums = (offset, limit) => {
        return this.__get(`${API_URL_ALBUMS}?offset=${offset}&limit=${limit}`)
    }

    getPlaylists = (offset, limit) =>{
        return this.__get(`${API_URL_PLAYLISTS}?offset=${offset}&limit=${limit}`)
    }
}

// exportamos un singleton...
export default new MusicService()