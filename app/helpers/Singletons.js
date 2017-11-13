class SingletonManager {
    static get(name) {
        if (global._singletons) {
            const instance = global._singletons['TOKEN_SERVICE']
            
            if (instance) return instance
            //else return global._singletons['TOKEN_SERVICE'] = new TokenService()
            else return null
        } else {
            //global._singletons = {}
            //return global._singletons['TOKEN_SERVICE'] = new TokenService()
            return null
        }
    }

    static create(name, singleton) {
        global._singletons = {}
        return global._singletons[name] = singleton
    }
}

export default SingletonManager