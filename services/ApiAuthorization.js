import Fetcher from './Fetcher'
import { API_URL_WELCOME, API_URL_REGISTER, API_URL_LOGIN, API_URL_LOGOUT } from '../constants'

class ApiAuthorization extends Fetcher {
    doRegister(registerData) {
        return this.__post(API_URL_REGISTER, registerData)
    }

    doLogin(loginData) {
        return this.__post(API_URL_LOGIN, loginData)
            .then( res => {
                console.log('doLogin:', res)
                this.__setToken(res.data)
                return res.data
            })
    }

    doLogout(username) {
        return this.__post(API_URL_LOGOUT, username)
            .then(res => {
                this.__setToken(null)
                return res
            })
    }

    amIAuthorized(token) {
        this.__setToken(token)
        return this.__get(API_URL_WELCOME)
    }
}

// exportamos un singleton...
export default new ApiAuthorization()
