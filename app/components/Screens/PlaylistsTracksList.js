import React, { Component } from 'react'

import { StyleSheet, View, TouchableHighlight, TouchableOpacity, Alert } from 'react-native'
import { Text, Icon } from 'native-base'
import { ListItem } from 'react-native-elements'

import { API_PAGE_LIMIT, SCREEN_PLAYLISTS_COLOR } from '../../constants'

import InfiniteList from '../InfiniteList'
import { getMMSSFromMillis } from '../../helpers/Functions'

import UserApi from '../../api/UserApi'
const userApi = new UserApi()

const TRACKS_ROW_HEIGHT = 63

export default class PlaylistsTracksList extends Component {
    constructor () {
        super()
        this.state = { currentTrackIndex: -1 }
    }

    _playAllTracksFromPlaylist () {
        this.setState({ currentTrackIndex: null })
        Alert.alert('play all')
    }
// SWIPE RIGHT
    _handleOnPlaylistsItemRightSwipe = (item, index) => {
        console.log(item)
        userApi.removeTrackFromPlaylist(this.props.playlistId, item.id)
            .then(
                this.playlistTracksRef._handleRefresh()
            )
            .catch(error => { Alert.alert(error.message) })
    }

    _renderRightSwipePlaylistsTracksItem = (item, index) => {
        return (
            <TouchableOpacity style={{ height: TRACKS_ROW_HEIGHT, width: TRACKS_ROW_HEIGHT, }} onPress={ () => this._handleOnPlaylistsItemRightSwipe(item, index) }>
                <View style={{ backgroundColor: SCREEN_PLAYLISTS_COLOR + 'D0', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name="ios-trash-outline" style={{ color: "#fff" }}/>
                </View>
            </TouchableOpacity>
        )
    }
// PLAYLIST TRACKS
    _playTrackFromPlaylist (item, index) {
        this.setState({ currentTrackIndex: index })
        this.props.playTrack(item)
    }

    _renderPlaylistTracksItem = (item, index) => {
        const LEFT_ICON = this.state.currentTrackIndex === index ? 'ios-headset-outline' : 'ios-musical-notes-outline'
        
        return (
            <View style={{ height: TRACKS_ROW_HEIGHT, backgroundColor: '#fff' }}>
            <ListItem containerStyle={ styles.item }
                underlayColor={ SCREEN_PLAYLISTS_COLOR + '60' }
                title={ item.name }
                subtitle={ `${item.album_name}, ${item.artist_name}` }
                leftIcon={{ name: LEFT_ICON, type: 'ionicon', style: { color: SCREEN_PLAYLISTS_COLOR } }}
                rightTitle={ getMMSSFromMillis(item.duration) }
                rightIcon={{ name: 'ios-play-outline', type: 'ionicon', style: { color: SCREEN_PLAYLISTS_COLOR, marginLeft: 15 } }}
                key={ item.id }
                onPress={ () => this._playTrackFromPlaylist(item, index) }/>
            </View>
        )
    }
// COMPONENT LIFE
    render () {
        return (
            <View style={{ flex: 1, padding: 10, backgroundColor: SCREEN_PLAYLISTS_COLOR + '40' }}>
                <View style={ styles.headerModal }>
                    <TouchableHighlight style={ styles.buttonHeader } underlayColor="rgba(255,255,255,0.3)" onPress={ this._playAllTracksFromPlaylist.bind(this) }>
                        <Text style={ styles.textHeader }>Play all</Text>
                    </TouchableHighlight>
                    <Text numberOfLines={ 1 } style={ styles.textPlaylist }>{ this.props.playlistName.toUpperCase() }</Text>
                    <TouchableHighlight style={ styles.buttonHeader } underlayColor="rgba(255,255,255,0.3)" onPress={ this.props.onClose }>
                        <Text style={ styles.textHeader }>Close</Text>
                    </TouchableHighlight>
                </View>
                <InfiniteList
                    ref={ c => this.playlistTracksRef = c }
                    getData={ userApi.getTracksFromPlaylist }
                    extraData={ this.state.currentTrackIndex }
                    filterBy= { this.props.playlistId }
                    limit={ API_PAGE_LIMIT }
                    renderItem={ this._renderPlaylistTracksItem }
                    rowHeight={ TRACKS_ROW_HEIGHT }
                    showSearchHeader={ false }
                    enableSwipe={ true }
                    renderRight={ this._renderRightSwipePlaylistsTracksItem }
                    swipeBackgroundColor={ 'transparent' }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerModal: { flex: -1, flexDirection: "row", justifyContent: "space-between", alignItems: 'center' },
    textHeader: { fontSize: 12, color: SCREEN_PLAYLISTS_COLOR + '80' },
    buttonHeader: { height: 20 },
    textPlaylist: { flex: -1, paddingHorizontal: 15, color: '#43484d' },
    item: { height: TRACKS_ROW_HEIGHT, justifyContent: 'center', backgroundColor: SCREEN_PLAYLISTS_COLOR + '40' },
})