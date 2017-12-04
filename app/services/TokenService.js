import { AsyncStorage } from 'react-native'
import SingletonManager from '../helpers/Singletons'

class TokenService {
    static get () {
        const instance = SingletonManager.get('TOKEN_SERVICE')

        return (instance !== null && instance !== undefined) ? instance : SingletonManager.create('TOKEN_SERVICE', new TokenService())
    }

    static setToken = (token) => {
         this.token = token
    }

    static getToken = () => {
        return this.token
    }

    static removeToken = () => {
        this.token = null
    }

    saveToken = (token) => {
        return AsyncStorage.setItem('@mtzfactory:token', token)
    }

    readToken = () => {
        return AsyncStorage.getItem('@mtzfactory:token')
    }

    deleteToken = () => {
        return AsyncStorage.removeItem('@mtzfactory:token')
    }
}

export default TokenService

//TokenService.get().getToken()