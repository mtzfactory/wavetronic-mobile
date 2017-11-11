import Fetcher from './Fetcher'
import { API_URL_TRACKS, API_URL_ALBUMS, API_URL_PLAYLISTS, API_URL_FRIENDS } from '../constants'

class ApiData extends Fetcher {

}

// exportamos un singleton...
export default new ApiData()