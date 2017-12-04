import TokenService from '../services/TokenService'

function checkStatus(res) {
    if (res.status >= 200 && res.status < 300) {
        return res
    }
    else {
        //const errorMessage = res.statusText === undefined ? res._bodyText : res.statusText
        console.log('Fetcher checkStatus:', res._bodyText)
        err = JSON.parse(res._bodyText)
        throw new Error(err.message)
    }
}

function parseJSON(res) {
    return res.json()
}

class Fetcher {
    constructor() {
        this.HEADERS = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

    timeoutFetch(input, init = {}) {
        const timeout = init && Number(init.timeout) || 8000
      
        return new Promise((resolve, reject) => {
            fetch(input, init).then(resolve, reject)
            setTimeout(() => reject(new TypeError('Client timed out')), timeout)
        })
    }

    getHeaders() {
        const token = TokenService.getToken() //TokenService.get().getToken()
        this.HEADERS['Authorization'] = `Bearer ${token}`

        console.log('Fetcher token:', token)
        
        return this.HEADERS
    }

    get (url, headers) {
        console.log('Fetcher get', url)
        return this.timeoutFetch(url, {
                method: 'GET',
                headers
            })
            .then(checkStatus)
            .then(parseJSON)
    }

    post (url, data) {
        console.log('Fetcher post', url)
        return this.timeoutFetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(checkStatus)
            .then(parseJSON)
    }

    postWithAuth(url, data) {
        console.log('Fetcher postWithAuth', url)
        return this.timeoutFetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            })
            .then(checkStatus)
            .then(parseJSON)
    }

    putWithAuth(url, data) {
        console.log('Fetcher putWithAuth', url)
        return this.timeoutFetch(url, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            })
            .then(checkStatus)
            .then(parseJSON)
    }

   delWithAuth(url) {
    console.log('Fetcher delWithAuth', url)
        return this.timeoutFetch(url, {
                method: 'DELETE',
                headers: this.getHeaders(),
            })
            .then(checkStatus)
            .then(parseJSON)
    }

    getWithAuth(url) {
        console.log('Fetcher getWithAuth', url)
        return this.timeoutFetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            })
            .then(checkStatus)
            .then(parseJSON)
    }
}

export default Fetcher