import Fetcher from '../helpers/Fetcher'
import TokenService from '../services/TokenService'
import { API_URL_WELCOME, API_URL_REGISTER, API_URL_LOGIN, API_URL_LOGOUT } from '../constants'
import {API_URL_PROFILE, API_URL_PLAYLISTS, API_URL_FRIENDS, API_URL_FAKE_FRIENDS } from '../constants'

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
        return this.fetcher.getWithAuth(`${API_URL_WELCOME}`)
    }
// api/v1/user
    getProfile = () => {
        return this.fetcher.getWithAuth(`${API_URL_PROFILE}`)
    }
    updatePushNotificationToken = (pnToken) => {
        return this.fetcher.putWithAuth(`${API_URL_PROFILE}`, { pnToken })
    }
// api/v1/user/friends
    getFriends = (offset, limit) => {
        return this.fetcher.getWithAuth(`${API_URL_FAKE_FRIENDS}?offset=${offset}&limit=${limit}`)
    }
    getRealFriends = (offset, limit) => {
        return this.fetcher.getWithAuth(`${API_URL_FRIENDS}?offset=${offset}&limit=${limit}`)
    }
// api/v1/user/friends/:friendId/track/:trackId
    sendTrackToFriend = (friendId, trackId) => {
        return this.fetcher.getWithAuth(`${API_URL_FRIENDS}/${friendId}/track/${trackId}`)
    }
// api/v1/user/playlists
    getPlaylists = (offset, limit, query) => {
        const search = query !== undefined && query !== null ? `&namesearch=${query.split(' ').join('+')}`: ''
        return this.fetcher.getWithAuth(`${API_URL_PLAYLISTS}?offset=${offset}&limit=${limit}${search}`)
    }

    addPlaylist = (name, description) => {
        return this.fetcher.postWithAuth(`${API_URL_PLAYLISTS}`, { name, description })
    }

    addTrackToPlaylist = (playlist, track) => {
        return this.fetcher.putWithAuth(`${API_URL_PLAYLISTS}/${playlist}/track/${track}`)
    }
// api/v1/user/playlists/:id
    getTracksFromPlaylist = (playlistId) => {
        return this.fetcher.getWithAuth(`${API_URL_PLAYLISTS}/${playlistId}`)
    }
}

// exportamos un singleton...
//export default new UserService()
export default UserApi