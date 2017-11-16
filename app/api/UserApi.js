import Fetcher from '../helpers/Fetcher'
import TokenService from '../services/TokenService'
import { API_URL_WELCOME, API_URL_REGISTER, API_URL_LOGIN, API_URL_LOGOUT } from '../constants'
import {API_URL_PROFILE, API_URL_PLAYLISTS, API_URL_FRIENDS } from '../constants'

class UserApi {
    constructor() {
        this.fetcher = new Fetcher()
    }

    doRegister(registerData) {
        return this.fetcher.post(API_URL_REGISTER, registerData)
    }

    doLogin(loginData) {
        return this.fetcher.postWithAuth(API_URL_LOGIN, loginData)
            .then( res => {
                TokenService.get().saveToken(res.data)
                return res.data
            })
    }

    doLogout(username) {
        return this.fetcher.postWithAuth(API_URL_LOGOUT, username)
            .then(res => {
                TokenService.get().saveToken(null)
                return res
            })
    }

    amIAuthorized(token) {
        return this.fetcher.getWithAuth(API_URL_WELCOME)
    }
// api/v1/user
    getProfile = () => {
        return this.fetcher.getWithAuth(`${API_URL_PROFILE}`)
    }
// api/v1/user/friends
    getFriends = (offset, limits) => {
        return this.fetcher.getWithAuth(`${API_URL_FRIENDS}?offset=${offset}&limit=${limit}`)
    }
// api/v1/user/playlists
    getPlaylists = (offset, limit) => {
        return this.fetcher.getWithAuth(`${API_URL_PLAYLISTS}?offset=${offset}&limit=${limit}`)
    }

    addPlaylist = (name, description) => {
        return this.fetcher.postWithAuth(API_URL_PLAYLISTS, {name, description})
    }
// api/vi1/user/playlists/:id
    getTracksFromPlaylist = (playlistId) => {
        return this.fetcher.getWithAuth(`${API_URL_PLAYLISTS}/${playlistId}`)
    }
}

// exportamos un singleton...
//export default new UserService()
export default UserApi