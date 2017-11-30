import React, { Component } from 'react'
import { StyleSheet, Platform, Dimensions, StatusBar, Easing, View, FlatList, TouchableHighlight, Alert } from 'react-native'
import { Text } from 'native-base'
import { ListItem } from 'react-native-elements'
import ActionButton from 'react-native-action-button'
import Modal from 'react-native-modalbox'

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')
import { API_PAGE_LIMIT, MAIN_THEME_COLOR, SCREEN_ALBUMS_COLOR, SCREEN_ALBUMS_DARK_COLOR } from '../../constants'

import FabNavigator from '../FabNavigator'
import InfiniteList from '../InfiniteList'
import AlbumsListItem from './AlbumsListItem'
import AlbumsTracksItem from './AlbumsTracksList'

import { getMMSSFromMillis } from '../../helpers/Functions'

import MusicApi from '../../api/MusicApi'
const musicApi = new MusicApi()

const THUMBNAIL_SIZE = 70
const ALBUMS_ROW_HEIGTH = THUMBNAIL_SIZE + 10 //17 + 17 // 70 por image + 2 * (17) ListItem paddingVertical
const TRACKS_ROW_HEIGHT = 50
const SCREEN = 'Albums'

export default class AlbumsScreen extends Component {
    static navigationOptions = {
        title: SCREEN,
        headerLeft: null,
        headerTitleStyle : { alignSelf: 'center', color: SCREEN_ALBUMS_COLOR },
        headerStyle: { backgroundColor: MAIN_THEME_COLOR }
    }

    constructor () {
        super()

        this.state = {
            showAlbumTracksModal: false,
            albumId: null,
            albumName: null,
        }
    }
// ALBUMS TRACKS MODAL
    _closeAlbumTracksModal = () => {
        this.refs.albumTracksModal.close()
    }

    _handleClosedAlbumTracksModal () {
        this.setState({ showAlbumTracksModal: false })
    }

    _playTrackFromAlbum = (track) => {
        this.props.screenProps.handlePlaySong(track)
    }
// RENDER ALBUMS
    _handleOnAlbumItemPressed (albumId, albumName) {
        this.setState({ showAlbumTracksModal: true, albumId, albumName })
        this.refs.albumTracksModal.open()
    }

    _renderAlbumsItem = (item, index) => (
        <AlbumsListItem style={{ height: THUMBNAIL_SIZE }}
            listItem={ item }
            size={ THUMBNAIL_SIZE }
            onItemPressed={ this._handleOnAlbumItemPressed.bind(this) }
        />
    )
// COMPONENT LIFE
    render () {
        const { navigate } = this.props.navigation
        const { orientation } = this.props.screenProps
        const { showAlbumTracksModal } = this.state

        return (
            <View style={ styles.container }>
                {
                    Platform.OS === 'android' && <StatusBar barStyle="light-content" backgroundColor={ SCREEN_ALBUMS_DARK_COLOR } />
                }
                <InfiniteList
                    getData={ musicApi.getAlbums }
                    limit={ API_PAGE_LIMIT }
                    renderItem={ this._renderAlbumsItem }
                    rowHeight={ ALBUMS_ROW_HEIGTH }
                    searchHolder='Search for albums ...'
                />
                <FabNavigator current={ SCREEN } navigate={ navigate } />
                <Modal ref={"albumTracksModal"}
                    style={ styles.modal }
                    position={"top"} entry={"top"} easing={Easing.ease}
                    backButtonClose={true}
                    onClosed={ this._handleClosedAlbumTracksModal.bind(this) }>
                    { showAlbumTracksModal && 
                        <AlbumsTracksItem
                            albumId={ this.state.albumId }
                            albumName={ this.state.albumName }
                            playTrack={ this._playTrackFromAlbum }
                            onClose={ this._closeAlbumTracksModal }/>
                    }
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    modal: { height: DEVICE_HEIGHT / 2 },
})