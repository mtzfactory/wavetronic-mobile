import React, { Component } from 'react'
import { StyleSheet, Platform, Dimensions, StatusBar, Easing, View, FlatList, TouchableHighlight, TouchableOpacity, TextInput, Alert } from 'react-native'
import { Text, Button, Icon } from 'native-base'
import { ListItem } from 'react-native-elements'
import ActionButton from 'react-native-action-button'
import Modal from 'react-native-modalbox'

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')
import { API_PAGE_LIMIT, MAIN_THEME_COLOR, SCREEN_PLAYLISTS_COLOR, SCREEN_PLAYLISTS_DARK_COLOR } from '../../constants'

import FabNavigator from '../FabNavigator'
import InfiniteList from '../InfiniteList'
import PlaylistsListItem from './PlaylistsListItem'
import PlaylistsTracksList from './PlaylistsTracksList'
import { getMMSSFromMillis } from '../../helpers/Functions'

import UserApi from '../../api/UserApi'
const userApi = new UserApi()

const PLAYLISTS_ROW_HEIGTH = 63
const SCREEN = 'Playlists'

export default class PlaylistsScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: SCREEN,
            headerLeft: null,
            headerRight: (
                    <TouchableHighlight 
                        underlayColor="rgba(255,255,255,0.4)"
                        style={ styles.rightHeaderButton }
                        onPress={ () => 
                            navigation.state.params.handleRightButtonPressed()
                        }>
                            <Icon name="md-add" style={{ color: SCREEN_PLAYLISTS_COLOR }}/>
                    </TouchableHighlight>
                ),
            headerTitleStyle : { marginLeft: 80, alignSelf: 'center', color: SCREEN_PLAYLISTS_COLOR },
            headerStyle: { backgroundColor: MAIN_THEME_COLOR }
        }
    }

    constructor () {
        super()

        this.state = {
            newPlaylistName: null,
            newPlaylistDescription: null,
            showPlaylistTracksModal: false,
            playlistId: null,
            playlistName: null,
        }
    }
// NEW PLAYLIST MODAL
    _addPlaylist = () => {
        const { newPlaylistName, newPlaylistDescription } = this.state

        if (newPlaylistName && newPlaylistDescription)
            userApi.addPlaylist(newPlaylistName, newPlaylistDescription)
                .then(res => {
                    this.refs.newPlaylistModal.close()
                    this.setState({ newPlaylistName: null, newPlaylistDescription: null })
                    this.playlistsRef._handleRefresh()
                })
                .catch(error => { Alert.alert(error.message) })
    }
// PLAYLISTS TRACKS MODAL
    _closePlaylistTracksModal = () => {
        this.refs.playlistTracksModal.close()
    }

    _handleClosedPlaylistTracksModal = () => {
        this.setState({ showPlaylistTracksModal: false })
    }

    _playTrackFromPlaylist = (track) => {
        this.props.screenProps.handlePlaySong(track)
    }
// SWIPE RIGHT
    _handleOnPlaylistsItemRightSwipe = (item, index) => {
        userApi.removePlaylist(item._id)
            .then(
                this.playlistsRef._handleRefresh()
            )
            .catch(error => { Alert.alert(error.message) })
    }

    _renderRightSwipePlaylistsItem = (item, index) => {
        return (
            <TouchableOpacity style={{ height: PLAYLISTS_ROW_HEIGTH, width: PLAYLISTS_ROW_HEIGTH, }} onPress={ () => this._handleOnPlaylistsItemRightSwipe(item, index) }>
                <View style={{ backgroundColor: SCREEN_PLAYLISTS_COLOR + 'D0', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name="ios-trash-outline" style={{ color: "#fff" }}/>
                </View>
            </TouchableOpacity>
        )
    }
// RENDER PLAYLISTS
    _handleOnPlaylistsItemPressed = (playlistId, playlistName) => {
        this.setState({ showPlaylistTracksModal: true, playlistId, playlistName })
        this.refs.playlistTracksModal.open()
    }

    _renderPlaylistsItem = (item, index) => (
        <PlaylistsListItem style={{ height: PLAYLISTS_ROW_HEIGTH }}
            item={ item }
            onItemPressed={ this._handleOnPlaylistsItemPressed }
        />
    )
// COMPONENT LIFE
    componentDidMount () {
        this.props.navigation.setParams({ handleRightButtonPressed: this.refs.newPlaylistModal.open })
    }

    render () {
        const { navigate } = this.props.navigation
        const { showPlaylistTracksModal, newPlaylistName, newPlaylistDescription } = this.state

        const BUTTON_DISABLED = newPlaylistName === null || newPlaylistDescription === null
        const BUTTON_COLOR = { backgroundColor: BUTTON_DISABLED ? '#c9c9c9' : SCREEN_PLAYLISTS_COLOR }

        return (
            <View style={ styles.container }>
                {
                    Platform.OS === 'android' && <StatusBar barStyle="light-content" backgroundColor={ SCREEN_PLAYLISTS_DARK_COLOR } />
                }
                <InfiniteList
                    ref={ c => this.playlistsRef = c }
                    getData={ userApi.getPlaylists }
                    limit={ API_PAGE_LIMIT }
                    renderItem={ this._renderPlaylistsItem }
                    rowHeight={ PLAYLISTS_ROW_HEIGTH }
                    searchHolder='Search for playlists ...'
                    enableSwipe={ true }
                    renderRight={ this._renderRightSwipePlaylistsItem }
                />
                <FabNavigator current={ SCREEN } navigate={ navigate } />
                <Modal ref={"playlistTracksModal"}
                    style={ styles.modal }
                    position={"top"} entry={"top"} easing={Easing.ease}
                    backButtonClose={ true }
                    onClosed={ this._handleClosedPlaylistTracksModal }>
                    { showPlaylistTracksModal && 
                        <PlaylistsTracksList
                            playlistId={ this.state.playlistId }
                            playlistName={ this.state.playlistName }
                            playTrack={ this._playTrackFromPlaylist }
                            onClose={ this._closePlaylistTracksModal }/>
                    }
                </Modal>
                <Modal ref={"newPlaylistModal"}
                    style={ styles.modal }
                    position={"center"} entry={"top"} easing={Easing.ease}
                    backButtonClose={ true }>
                    <View style={ styles.formModal }>
                        <View style={ styles.headerModal }>
                            <Text style={ styles.titleHeader }>NEW PLAYLIST</Text>
                            <TouchableHighlight underlayColor="rgba(255,255,255,0.3)" onPress={ () => this.refs.newPlaylistModal.close() }>
                                <Text style={ styles.textHeader }>Close</Text>
                            </TouchableHighlight>
                        </View>
                        <TextInput style={ styles.inputForm }
                            ref={ c => this.name = c}
                            autoFocus={ true }
                            autoCapitalize="words"
                            blurOnSubmit={ false }
                            placeholder="playlist name"
                            onChangeText={ newPlaylistName => this.setState({ newPlaylistName }) }
                            onSubmitEditing={ () => this.description.focus() }
                        />
                        <TextInput style={ styles.inputForm }
                            ref={ c => this.description = c}
                            autoCapitalize="sentences"
                            blurOnSubmit={ true }
                            placeholder="description"
                            onChangeText={ newPlaylistDescription => this.setState({ newPlaylistDescription }) }
                        />
                        <Button block style={[ styles.submit, BUTTON_COLOR ]} disabled={ BUTTON_DISABLED } onPress={ this._addPlaylist }>
                            <Text>Add</Text>
                        </Button>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    rightHeaderButton: { marginRight: 5, padding: 15, borderRadius:50, },
    modal: { height: DEVICE_HEIGHT / 2, backgroundColor: '#fff' },
    formModal: { margin: 25, flex: 1, flexDirection: 'column' },
    headerModal: { flex: -1, flexDirection: "row", justifyContent: "space-between", alignItems: 'center' },
    titleHeader: { textAlign: 'center', color: SCREEN_PLAYLISTS_DARK_COLOR },
    textHeader: { fontSize: 12, color: SCREEN_PLAYLISTS_COLOR + '80' },
    inputForm: { marginTop: 15, borderBottomWidth: 2, borderBottomColor: SCREEN_PLAYLISTS_COLOR },
    buttonHeader: { height: 20 },
    textPlaylist: { flex: -1, paddingHorizontal: 15, color: '#43484d' },
    submit: { marginTop: 35, position: 'absolute', bottom: 0, width: '100%', backgroundColor: SCREEN_PLAYLISTS_COLOR },
})