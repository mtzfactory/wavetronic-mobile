function checkStatus(res) {
    //console.log('checkStatus:', res)
    if (res.status >= 200 && res.status < 300) {
        return res
    }
    else {
        const errorMessage = res.statusText === undefined ? res._bodyText : res.statusText
        var error = new Error(errorMessage)
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
    }

    __setToken(token) {
        if (token)
            this.HEADERS['Authorization'] = `Bearer ${token}`
    }

    __post(url, data) {
        return fetch(url, {
                method: 'POST',
                headers: this.HEADERS,
                body: JSON.stringify(data)
            })
            .then(checkStatus)
            .then(parseJSON)
    }

    __put(url, data) {
        return fetch(url, {
                method: 'PUT',
                headers: this.HEADERS,
                body: JSON.stringify(data)
            })
            .then(checkStatus)
            .then(parseJSON)
    }

    __get(url) {
        //console.log('__get' urll, 'HEADERS:', this.HEADERS)
        return fetch(url, {
                method: 'GET',
                headers: this.HEADERS,
            })
            .then(checkStatus)
            .then(parseJSON)
    }
}

export default Fetcher