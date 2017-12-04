
//const HOST = '192.168.1.129'  // CREMOSA
//const HOST = '192.168.1.100'    // HOME
//const HOST = '192.168.0.39'   // SKYLAB
const HOST = 'wavemybeat-api.herokuapp.com'

// API
//const PORT = 3001

const TYPE = 'https://'
//const TYPE = 'http://'

//const SRV_URL_BASE = `${TYPE}${HOST}:${PORT}`
const SRV_URL_BASE = `${TYPE}${HOST}`
const API_URL_BASE = `${SRV_URL_BASE}/api/v1`

export const API_URL_REGISTER = `${SRV_URL_BASE}/auth/register`
export const API_URL_LOGIN = `${SRV_URL_BASE}/auth/login`

export const API_URL_WELCOME = `${API_URL_BASE}`

export const API_URL_JMO_TRACKS = `${API_URL_BASE}/tracks`
export const API_URL_JMO_ALBUMS = `${API_URL_BASE}/albums`
export const API_URL_JMO_PLAYLISTS = `${API_URL_BASE}/playlists`

export const API_URL_PROFILE = `${API_URL_BASE}/user`
export const API_URL_PLAYLISTS = `${API_URL_BASE}/user/playlists`
export const API_URL_FRIENDS = `${API_URL_BASE}/user/friends`

export const API_URL_LOGOUT = `${API_URL_BASE}/user/logout`

export const API_PAGE_LIMIT = 50

// APP
export const STATUSBAR_HEIGHT = 24
export const HEADER_HEIGHT = 56
export const PLAYER_HEIGHT = 45

export const LANDSCAPE = 'LANDSCAPE'
export const PORTRAIT = 'PORTRAIT'

// APP COLORS
export const PRIMARY_COLOR = '#009688'
export const DARK_PRIMARY_COLOR = '#00796B'

export const FABNAVIGATOR_COLOR = '#E91E63' //'#CE3175'
export const MAIN_THEME_COLOR = '#E1E8EE'
export const MAIN_DARK_THEME_COLOR = '#AFB6BC'

export const SPLASH_COLOR = PRIMARY_COLOR //'#FF1744'

export const SCREEN_PLAYLISTS_COLOR = '#E91E63' //'#673AB7' //'#9b59b6'
export const SCREEN_PLAYLISTS_DARK_COLOR = '#C2185B' //'#512DA8'

export const SCREEN_ALBUMS_COLOR = '#2196F3' //'#3498db'
export const SCREEN_ALBUMS_DARK_COLOR = '#1976D2'

export const SCREEN_SONGS_COLOR = '#009688' //'#1abc9c'
export const SCREEN_SONGS_DARK_COLOR = '#00796B'

export const SCREEN_CONTACTS_COLOR = '#AB47BC' //'#FFD700' //'#F1C40F'
export const SCREEN_CONTACTS_DARK_COLOR = '#790e8b' //'#C7A600' //'#FBC02D'

export const POSITIVE = '#009688'
export const NEGATIVE = '#E91E63'