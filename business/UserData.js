import Fetcher from '../helpers/Fetcher'
import TokenService from '../services/TokenService'
import { API_URL_WELCOME, API_URL_REGISTER, API_URL_LOGIN, API_URL_LOGOUT } from '../constants'
import { API_URL_FRIENDS } from '../constants'

class UserData {
    constructor() {
        this.fetcher = new Fetcher()
    }

    doRegister(registerData) {
        return this.fetcher.post(API_URL_REGISTER, registerData)
    }

    doLogin(loginData) {
        return this.fetcher.postWithAuth(API_URL_LOGIN, loginData)
            .then( res => {
                console.log('doLogin:', res)
                //this.fetcher.setToken(res.data)
                TokenService.get().saveToken(res.data)
                return res.data
            })
    }

    doLogout(username) {
        return this.fetcher.postWithAuth(API_URL_LOGOUT, username)
            .then(res => {
                //this.fetcher.setToken(null)
                TokenService.get().saveToken(null)
                return res
            })
    }

    amIAuthorized(token) {
        //this.fetcher.setToken(token)
        //TokenService.get().saveToken(token)
        //this.fetcher.setToken(token)
        return this.fetcher.getWithAuth(API_URL_WELCOME)
    }

    getFriends(offset, limits) {
        return this.fetcher.getWithAuth(`${API_URL_FRIENDS}?offset=${offset}&limit=${limit}`)
    }
}

// exportamos un singleton...
//export default new UserService()
export default UserData