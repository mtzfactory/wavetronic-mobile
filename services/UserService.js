import Fetcher from './Fetcher'
import { API_URL_FRIENDS } from '../constants'

class UserService extends Fetcher {
    getFriends(offset, limits) {
        return this.__get(`${API_URL_FRIENDS}?offset=${offset}&limit=${limit}`)
    }
}

// exportamos un singleton...
export default new UserService()