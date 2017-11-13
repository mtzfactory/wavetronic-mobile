import TokenService from '../services/TokenService'

function checkStatus(res) {
    //console.log('checkStatus:', res)
    if (res.status >= 200 && res.status < 300) {
        return res
    }
    else {
        const errorMessage = res.statusText === undefined ? res._bodyText : res.statusText
        const error = new Error(errorMessage)
        error.code = res.status
        error.response = res
        throw error
    }
}

function parseJSON(res) {
    //console.log('parseJSON:', res)
    return res.json()
}

class Fetcher {
    constructor() {
        this.HEADERS = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        this.token = null
    }

    setToken(token) {
         //TokenService.get().saveToken(token)
        this.token = token
        this.HEADERS['Authorization'] = `Bearer ${token}`
    }

    getHeaders() {
        if (!this.token) {
            this.token = TokenService.get().getToken()
            this.HEADERS['Authorization'] = `Bearer ${this.token}`
        }
        
        return this.HEADERS
    }

    setAuthHeader() {
        this.HEADERS['Authorization'] = `Bearer ${TokenService.get().getToken()}`
        // return Promise.resolve().then(() => {
        //     if (this.token)
        //         return null

        //     return TokenService.get().readToken()
        //         .then(token => {
        //             if (token) {
        //                 this.token = token
        //                 this.HEADERS['Authorization'] = `Bearer ${token}`
        //                 console.log(this.HEADERS)
        //             }
        //         })
        //     })
    }

    postWithAuth(url, data) {
        if (!this.token)
            this.setAuthHeader()

        return fetch(url, {
                method: 'POST',
                headers: this.HEADERS,
                body: JSON.stringify(data)
            })
            .then(checkStatus)
            .then(parseJSON)
    }

    putWithAuth(url, data) {
        if (!this.token)
            this.setAuthHeader()

        return fetch(url, {
                method: 'PUT',
                headers: this.HEADERS,
                body: JSON.stringify(data)
            })
            .then(checkStatus)
            .then(parseJSON)
    }

    getWithAuth(url) {
        // if (!this.token)
        //     this.setAuthHeader()
        
        return fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            })
            .then(checkStatus)
            .then(parseJSON)
        // return this.setAuthHeader()
        //     .then(() => {
        //         return fetch(url, {
        //             method: 'GET',
        //             headers: this.HEADERS,
        //         })
        //         .then(checkStatus)
        //         .then(parseJSON)
        //     })
    }
}

export default Fetcher