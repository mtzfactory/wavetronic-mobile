import React, { Component } from 'react'
import { StyleSheet, Platform, Keyboard, Dimensions, StatusBar, Easing, View, FlatList, TouchableHighlight, TextInput, Alert } from 'react-native'
import { Text, Button, Icon } from 'native-base'
import { ListItem } from 'react-native-elements'
import ActionButton from 'react-native-action-button'
import Modal from 'react-native-modalbox'

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')
import { MAIN_THEME_COLOR, SCREEN_PLAYLISTS_COLOR, SCREEN_PLAYLISTS_DARK_COLOR } from '../../constants'

import FabNavigator from '../FabNavigator'
import InfiniteList from '../InfiniteList'
import PlaylistsListItem from './PlaylistsListItem'
import { getMMSSFromMillis } from '../../helpers/Functions'

import UserApi from '../../api/UserApi'
const userApi = new UserApi()

const PLAYLISTS_ROW_HEIGTH = 63
const TRACKS_ROW_HEIGHT = 63
const SCREEN = 'Playlists'

export default class PlaylistsScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: SCREEN,
            headerLeft: null,
            headerRight: (
                    <TouchableHighlight 
                        underlayColor="rgba(255,255,255,0.3)"
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
            playlistTracks: [],
            currentTrackIndex: -1
        }
    }

    _addPlaylist () {
        const { newPlaylistName, newPlaylistDescription } = this.state

        Keyboard.dismiss()

        if (newPlaylistName && newPlaylistDescription)
            userApi.addPlaylist(newPlaylistName, newPlaylistDescription)
                .then(res => {
                    this.refs.newPlaylistModal.close()
                    this.setState({ newPlaylistName: null, newPlaylistDescription: null })
                    this.playlists._handleRefresh()
                })
                .catch(error => { Alert.alert(error.message) })
    }

    _playAllTracksFromPlaylist () {
        this.refs.playlistTracksModal.close()
        this.setState({ currentTrackIndex: null })
        Alert.alert('play all')
    }

    _playTrackFromPlaylist (index) {
        this.setState({ currentTrackIndex: index })
        this.props.screenProps.handlePlaySong(this.state.playlistTracks[index])
    }

    _getPlaylistTracksItemLayout = (data, index) => {
        return {
            offset: TRACKS_ROW_HEIGHT * index,
            length: TRACKS_ROW_HEIGHT,
            index
        }
    }

    _renderPlaylistTracksItem (item, index) {
        const LEFT_ICON = this.state.currentTrackIndex === index ? 'ios-headset-outline' : 'ios-musical-notes-outline'
        
        return <ListItem
            title={ item.name }
            subtitle={ `${item.album_name}, ${item.artist_name}` }
            leftIcon={{ name: LEFT_ICON, type: 'ionicon', style: { color: SCREEN_PLAYLISTS_COLOR } }}
            rightTitle={ getMMSSFromMillis(item.duration) }
            rightIcon={{ name: 'ios-play-outline', type: 'ionicon', style: { color: SCREEN_PLAYLISTS_COLOR, marginLeft: 15 } }}
            //onPressRightIcon={ () => this._selectPlaylistToAddTrack(index) }
            key={ item.id }
            onPress={ () => this._playTrackFromPlaylist(index) }/>
    }

    _renderPlaylistTracks () {
        return (
            <View style={{ flex: 1, padding: 10, backgroundColor: SCREEN_PLAYLISTS_COLOR + '40' }}>
                <View style={ styles.headerModal }>
                    <TouchableHighlight style={ styles.buttonHeader } underlayColor="rgba(255,255,255,0.3)" onPress={ this._playAllTracksFromPlaylist.bind(this) }>
                        <Text style={ styles.textHeader }>Play all</Text>
                    </TouchableHighlight>
                    <Text numberOfLines={ 1 } style={ styles.textPlaylist }>{ this.state.playlistName.toUpperCase() }</Text>
                    <TouchableHighlight style={ styles.buttonHeader } underlayColor="rgba(255,255,255,0.3)" onPress={ () => this.refs.playlistTracksModal.close() }>
                        <Text style={ styles.textHeader }>Close</Text>
                    </TouchableHighlight>
                </View>
                <FlatList
                    ref={ c => this.playlists = c }
                    data={ this.state.playlistTracks }
                    extraData={ this.state.currentTrackIndex }
                    renderItem={ ({item, index}) => this._renderPlaylistTracksItem(item, index) }
                    getItemLayout={ this._getPlaylistTracksItemLayout }
                    keyExtractor={ (item, index) => item.id }
                />
            </View>
        )
    }

    _handleClosedPlaylistTracksModal () {
        this.setState({ showPlaylistTracksModal: false })
    }

    _handleOnPlaylistsItemPressed (playlistId, playlistName) {
        userApi.getTracksFromPlaylist(playlistId)
            .then(res => {
                this.setState({ showPlaylistTracksModal: true, playlistId, playlistName, currentTrackIndex: -1, playlistTracks: res.results })
                this.refs.playlistTracksModal.open()
            })
            .catch(error => { Alert.alert(error.message) })
    }

    _renderPlaylistsItem = (item, index) => (
        <PlaylistsListItem
            item={ item }
            onItemPressed={ this._handleOnPlaylistsItemPressed.bind(this) }
        />
    )

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
                    getData={ userApi.getPlaylists }
                    renderItem={ this._renderPlaylistsItem }
                    rowHeight={ PLAYLISTS_ROW_HEIGTH }
                    searchHolder='Search for playlists ...'
                />
                <FabNavigator current={ SCREEN } navigate={ navigate } />
                <Modal ref={"playlistTracksModal"}
                    style={ styles.modal }
                    position={"top"} entry={"top"} easing={Easing.ease}
                    backButtonClose={true}
                    onClosed={ this._handleClosedPlaylistTracksModal.bind(this) }>
                    { showPlaylistTracksModal && this._renderPlaylistTracks() }
                </Modal>
                <Modal ref={"newPlaylistModal"}
                    style={ styles.modal }
                    position={"center"} entry={"top"} easing={Easing.ease}
                    backButtonClose={true}>
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
                            placeholder="description"
                            onChangeText={ newPlaylistDescription => this.setState({ newPlaylistDescription }) }
                            onSubmitEditing={ () => Keyboard.dismiss() }
                        />
                        <Button block style={[ styles.submit, BUTTON_COLOR ]} disabled={ BUTTON_DISABLED } onPress={ this._addPlaylist.bind(this) }>
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