import { AsyncStorage } from 'react-native'
import SingletonManager from '../helpers/Singletons'

class TokenService {
    static get () {
        const instance = SingletonManager.get('TOKEN_SERVICE')

        return instance ? instance : SingletonManager.create('TOKEN_SERVICE', new TokenService())
    }

    setToken (token) {
         this.token = token
    }

    getToken () {
        return this.token
    }

    readToken () {
        return AsyncStorage.getItem('@mtzfactory:token')
    }

    saveToken (token) {
        this.token = token
        return AsyncStorage.setItem('@mtzfactory:token', token)
    }

    removeToken (token) {
        return AsyncStorage.removeItem('@mtzfactory:token')
    }

    getUsername () {
        if (this.username)
            return this.username
        else
            return this.readUsername()
    }

    readUsername () {
        return AsyncStorage.getItem('@mtzfactory:username')
    }

    saveUsername (username) {
        this.username = username
        return AsyncStorage.setItem('@mtzfactory:username', username)
    }

    removeUsername () {
        return AsyncStorage.removeItem('@mtzfactory:username')
    }
}

export default TokenService

//TokenService.get().getToken()