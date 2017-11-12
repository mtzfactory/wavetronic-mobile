
//const HOST = '192.168.1.129'  // CREMOSA
const HOST = '192.168.1.100'    // HOME
//const HOST = '192.168.0.39'   // SKYLAB

// API
const PORT = 3001

const SRV_URL_BASE = `http://${HOST}:${PORT}`
const API_URL_BASE = `${SRV_URL_BASE}/api/v1`

export const API_URL_REGISTER = `${SRV_URL_BASE}/auth/register`
export const API_URL_LOGIN = `${SRV_URL_BASE}/auth/login`
export const API_URL_LOGOUT = `${SRV_URL_BASE}/auth/revoke`
export const API_URL_WELCOME = `${API_URL_BASE}`

export const API_URL_TRACKS = `${API_URL_BASE}/tracks`
export const API_URL_ALBUMS = `${API_URL_BASE}/albums`
export const API_URL_PLAYLISTS = `${API_URL_BASE}/playlists`
export const API_URL_FRIENDS = 'https://randomuser.me/api/?results=20'

export const API_PAGE_LIMIT = 15

// APP
export const STATUSBAR_HEIGHT = 24
export const HEADER_HEIGHT = 56
export const PLAYER_HEIGHT = 45

// APP COLORS
const RED = '#E91E63'
const DARK_RED = '#C2185B'

const GREEN = '#17A589' //'#1DB954'
const DARK_GREEN = '#138D75' //'#007D2A'

const GREY = '#839192'
const DARK_GREY = '#707B7C'

const BLUEGREY = '#34495E'
const DARK_BLUEGREY = '#2C3E50'

export const PRIMARY_COLOR =  RED
export const DARK_PRIMARY_COLOR =  DARK_RED

export const SCREEN_SONGS_COLOR = '#9b59b6'
export const SCREEN_ALBUMS_COLOR = '#3498db'
export const SCREEN_PLAYLISTS_COLOR = '#1abc9c'
export const SCREEN_CONTACTS_COLOR = '#F1C40F'

