
//const HOST = '192.168.1.129'  // CREMOSA
//const HOST = '192.168.1.100'    // HOME
const HOST = '192.168.0.39'   // SKYLAB

// API
const PORT = 3001

const SRV_URL_BASE = `http://${HOST}:${PORT}`
const API_URL_BASE = `${SRV_URL_BASE}/api/v1`

export const API_URL_REGISTER = `${SRV_URL_BASE}/auth/register`
export const API_URL_LOGIN = `${SRV_URL_BASE}/auth/login`
export const API_URL_LOGOUT = `${SRV_URL_BASE}/auth/revoke`
export const API_URL_WELCOME = `${API_URL_BASE}`

export const API_URL_JMO_TRACKS = `${API_URL_BASE}/tracks`
export const API_URL_JMO_ALBUMS = `${API_URL_BASE}/albums`
export const API_URL_JMO_PLAYLISTS = `${API_URL_BASE}/playlists`

export const API_URL_PROFILE = `${API_URL_BASE}/user`
export const API_URL_PLAYLISTS = `${API_URL_BASE}/user/playlists`
//export const API_URL_USR_PLAYLISTS = `${API_URL_BASE}/user/friends`
export const API_URL_FRIENDS = 'https://randomuser.me/api/?results=20'

export const API_PAGE_LIMIT = 15

// APP
export const STATUSBAR_HEIGHT = 24
export const HEADER_HEIGHT = 56
export const PLAYER_HEIGHT = 45

// APP COLORS
export const SPLASH_COLOR = '#FF1744'

export const PRIMARY_COLOR =  '#E91E63'
export const DARK_PRIMARY_COLOR =  '#C2185B'

export const SCREEN_SONGS_COLOR = '#673AB7' //'#9b59b6'
export const SCREEN_SONGS_DARK_COLOR = '#512DA8'
export const SCREEN_ALBUMS_COLOR = '#2196F3' //'#3498db'
export const SCREEN_ALBUMS_DARK_COLOR = '#1976D2'
export const SCREEN_PLAYLISTS_COLOR = '#009688' //'#1abc9c'
export const SCREEN_PLAYLISTS_DARK_COLOR = '#00796B'
export const SCREEN_CONTACTS_COLOR = '#FFEB3B' //'#F1C40F'
export const SCREEN_CONTACTS_DARK_COLOR = '#FBC02D'

