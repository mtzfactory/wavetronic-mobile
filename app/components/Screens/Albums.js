import React, { Component } from 'react'
import { StyleSheet, Platform, Dimensions, StatusBar, Easing, View, FlatList, TouchableHighlight, Alert } from 'react-native'
import { Text } from 'native-base'
import { ListItem } from 'react-native-elements'
import ActionButton from 'react-native-action-button'
import Modal from 'react-native-modalbox'

import { MAIN_THEME_COLOR, SCREEN_ALBUMS_COLOR, SCREEN_ALBUMS_DARK_COLOR } from '../../constants'

import FabNavigator from '../FabNavigator'
import InfiniteList from '../InfiniteList'
import AlbumsListItem from './AlbumsListItem'

import { getMMSSFromMillis } from '../../helpers/Functions'

import MusicApi from '../../api/MusicApi'
const musicApi = new MusicApi()

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')
const THUMBNAIL_SIZE = 70
const ALBUM_ROW_HEIGTH = THUMBNAIL_SIZE + 10 //17 + 17 // 70 por image + 2 * (17) ListItem paddingVertical
const TRACK_ROW_HEIGHT = 50
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
            albumsTracks: [],
            currentTrackIndex: -1
        }
    }

    _playAllTracksFromAlbum () {
        this.refs.albumTracksModal.close()
        this.setState({ currentTrackIndex: null })
        Alert.alert('play all')
    }

    _playTrackFromAlbum (index) {
        this.setState({ currentTrackIndex: index })
        this.props.screenProps.handlePlaySong(this.state.albumsTracks.tracks[index])
    }

    _getAlbumTracksItemLayout = (data, index) => {
        return {
            offset: TRACK_ROW_HEIGHT * index,
            length: TRACK_ROW_HEIGHT,
            index
        }
    }

    _renderAlbumTracksItem(item, index) {
        const LEFT_ICON = this.state.currentTrackIndex === index ? 'ios-headset-outline' : 'ios-musical-notes-outline'
        
        return <ListItem
            title={ `${item.position} - ${item.name}` }
            leftIcon={{ name: LEFT_ICON, type: 'ionicon', style: { color: SCREEN_ALBUMS_COLOR } }}
            rightTitle={ getMMSSFromMillis(item.duration) }
            rightIcon={{ name: 'ios-play-outline', type: 'ionicon', style: { color: SCREEN_ALBUMS_COLOR, marginLeft: 15 } }}
            //onPressRightIcon={ () => this._selectPlaylistToAddTrack(index) }
            key={ item.id }
            onPress={ () => this._playTrackFromAlbum(index) }/>
    }

    _renderAlbumTracks () {
        return (
            <View style={{ flex: 1,  padding: 10, backgroundColor: SCREEN_ALBUMS_COLOR + '40' }}>
                <View style={ styles.headerModal }>
                    <TouchableHighlight style={ styles.buttonHeader } underlayColor="rgba(255,255,255,0.3)" onPress={ this._playAllTracksFromAlbum.bind(this) }>
                        <Text style={ styles.textHeader }>Play all</Text>
                    </TouchableHighlight>
                    <Text numberOfLines={ 1 } style={ styles.textAlbum }>{ this.state.albumName.toUpperCase() }</Text>
                    <TouchableHighlight style={ styles.buttonHeader } underlayColor="rgba(255,255,255,0.3)" onPress={ () => this.refs.albumTracksModal.close() }>
                        <Text style={ styles.textHeader }>Close</Text>
                    </TouchableHighlight>
                </View>
                <FlatList
                    data={ this.state.albumsTracks.tracks }
                    extraData={ this.state.currentTrackIndex }
                    renderItem={ ({item, index}) => this._renderAlbumTracksItem(item, index) }
                    getItemLayout={ this._getAlbumTracksItemLayout }
                    keyExtractor={ (item, index) => item.id }
                />
            </View>
        )
    }

    _handleClosedAlbumTracksModal () {
        this.setState({ showAlbumTracksModal: false })
    }

    _handleOnAlbumItemPressed (albumId, albumName) {
        musicApi.getTracksFromAlbum(albumId)
            .then(res => {
                this.setState({ showAlbumTracksModal: true, albumId, albumName, currentTrackIndex: -1, albumsTracks: res.results[0] })
                this.refs.albumTracksModal.open()
            })
            .catch(error => { Alert.alert(error.message) })
    }

    _renderAlbumsItem = (item, index) => (
        <AlbumsListItem
            listItem={ item }
            size={ THUMBNAIL_SIZE }
            onItemPressed={ this._handleOnAlbumItemPressed.bind(this) }
        />
    )

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
                    renderItem={ this._renderAlbumsItem }
                    rowHeight={ ALBUM_ROW_HEIGTH }
                    searchHolder='Search for albums ...'
                />
                <FabNavigator current={ SCREEN } navigate={ navigate } />
                <Modal ref={"albumTracksModal"}
                    style={ styles.modal }
                    position={"top"} entry={"top"} easing={Easing.ease}
                    backButtonClose={true}
                    onClosed={ this._handleClosedAlbumTracksModal.bind(this) }>
                    { showAlbumTracksModal && this._renderAlbumTracks() }
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    modal: { height: DEVICE_HEIGHT / 2 },
    headerModal: { marginBottom: 2, flexDirection: "row", justifyContent: "space-between", alignItems: 'center' },
    buttonHeader: { height: 20 },
    titleHeader: { textAlign: 'center' },
    textHeader: { fontSize: 12, color: SCREEN_ALBUMS_COLOR + '80' },
    textAlbum: { flex: -1, paddingHorizontal: 15, color: '#43484d' },
})