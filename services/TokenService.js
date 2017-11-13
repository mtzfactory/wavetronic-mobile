import { AsyncStorage } from 'react-native'
import SingletonManager from '../helpers/Singletons'

class TokenService {
    static get() {
        const instance = SingletonManager.get('TOKEN_SERVICE')

        return instance ? instance : SingletonManager.create('TOKEN_SERVICE', new TokenService())
    }

    setToken(token) {
         this.token = token
    }

    getToken() {
        return this.token
    }

    readToken() {
        return AsyncStorage.getItem('@mtzfactory:token')
    }

    saveToken(token) {
        this.token = token
        return AsyncStorage.setItem('@mtzfactory:token', token)
    }
}

export default TokenService

//TokenService.get().getToken()