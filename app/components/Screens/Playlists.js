import React, { Component } from 'react'
import { StyleSheet, Platform, StatusBar, View, TouchableHighlight, Alert, TextInput } from 'react-native'
import { Content, Text, Button, Icon, Form, Item } from 'native-base'
import ActionButton from 'react-native-action-button'
import Modal from 'react-native-modalbox'

import { LANDSCAPE, PORTRAIT, MAIN_THEME_COLOR, SCREEN_PLAYLISTS_COLOR, SCREEN_PLAYLISTS_DARK_COLOR } from '../../constants'

import FabNavigator from '../FabNavigator'
import InfiniteList from '../InfiniteList'
import PlaylistsListItem from './PlaylistsListItem'

import UserApi from '../../api/UserApi'
const userApi = new UserApi()

const SCREEN = 'Playlists'

export default class PlaylistsScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: SCREEN,
            headerLeft: null,
            headerRight: <TouchableHighlight 
                underlayColor="rgba(255,255,255,0.3)"
                style={styles.rightHeaderButton}
                onPress={ () => 
                    navigation.state.params.handleRightButtonPressed()
                }>
                    <Icon name="md-add" style={{ color: SCREEN_PLAYLISTS_COLOR }}/>
                </TouchableHighlight>,
            headerTitleStyle : { marginLeft: 80, alignSelf: 'center', color: SCREEN_PLAYLISTS_COLOR },
            headerStyle: { backgroundColor: MAIN_THEME_COLOR }
        }
    }

    constructor () {
        super()

        this.state = {
            newPlaylistName: null,
            newPlaylistDescription: null,
            columns: 1,
            showModal: false,
            playlistId: null,
            playlistTracks: null,
            currentTrackIndex: 0
        }
    }

    _onAddPlaylist () {
        const { newPlaylistName, newPlaylistDescription } = this.state

        if (newPlaylistName && newPlaylistDescription)
            Promise.resolve()
                .then( () => {
                    return userApi.addPlaylist(newPlaylistName, newPlaylistDescription)
                        .then(res => {
                            console.log(res)
                            this.refs.newPlaylistModal.close()
                        })
                        .catch(error => { Alert.alert(error.message) })
                })
                .then(() => this.setState({ newPlaylistName: null, newPlaylistDescription: null }))
    }

    _playTrackFromPlaylist (index) {
        this.setState({ currentTrackIndex: index })
        this.props.screenProps.handlePlaySong(track)
    }

    _renderPlaylistTracksItem (item, index) {
        const LEFT_ICON = this.state.currentTrackIndex === index ? 'ios-headset-outline' : 'ios-musical-notes-outline'
        
        return <ListItem
            title={ item.name }
            subtitle={ `${item.album_name}, ${item.artist_name}` }
            leftIcon={{ name: LEFT_ICON, type: 'ionicon', style: { color: PRIMARY_COLOR } }}
            rightTitle={ getMMSSFromMillis(item.duration) }
            rightIcon={{ name: 'md-add', type: 'ionicon', style: { color: PRIMARY_COLOR, marginLeft: 15 } }}
            onPressRightIcon={ () => this._selectPlaylistToAddTrack(index) }
            key={ item.id }
            onPress={ () => this._playTrackFromPlaylist(index) }/>
    }

    _renderPlaylistTracks () {
        return (
            <FlatList
                data={ this.state.playlistTracks }
                extraData={ this.state.currentTrackIndex }
                renderItem={ ({item, index}) => this._renderPlaylistTracksItem(item, index) }
                getItemLayout={ this._getTrackHistoryItemLayout }
                keyExtractor={ item => item.id }
            />
        )
    }

    _handleOnItemPressed (playlistId) {
        userApi.getTracksFromPlaylist(this.state.playlistId)
            .then(res => {
                this.setState({ showModal: true, playlistId, playlistTracks: res.results })
            })
            .catch(error => Alert.alert(error.message))
    }

    _renderPlaylistsItem = (item) => (
        <PlaylistsListItem
            listItem={ item }
            columns={ this.state.columns }
            onItemPressed={ this._handleOnItemPressed.bind(this) }
        />
    )

    componentWillReceiveProps (newProps) {
        const { orientation } =  newProps.screenProps

        if (orientation !== this.props.screenProps.orientation) {
            this.setState({ columns: orientation === PORTRAIT ? 1 : 2 })
        }
    }

    componentDidMount () {
        this.props.navigation.setParams({ handleRightButtonPressed: this.refs.newPlaylistModal.open })
    }

    render () {
        const ROW_HEIGTH = 80 + 15 + 15 // 80 por Thumbnail large + 2 * (12+3) ListItem paddingVertical
        const { navigate } = this.props.navigation
        const { orientation } = this.props.screenProps
        const { columns, showModal } = this.state

        return (
            <View style={ styles.container }>
                {
                    Platform.OS === 'android' && <StatusBar barStyle="light-content" backgroundColor={ SCREEN_PLAYLISTS_DARK_COLOR } />
                }
                <InfiniteList
                    getData={ userApi.getPlaylists }
                    renderItem={ this._renderPlaylistsItem }
                    rowHeight={ ROW_HEIGTH }
                    searchHolder='Search for playlists ...'
                    listKey={ orientation === LANDSCAPE ? 'h' : 'v' }
                    columns={ columns }
                />
                <FabNavigator current={ SCREEN } navigate={ navigate } />
                <Modal ref={"playlistTracks"} style={ styles.modal } position={"bottom"}>
                    { showModal && this._renderPlaylistTracks() }
                </Modal>
                <Modal ref={"newPlaylistModal"} style={ styles.modal } position={"center"}>
                    <View style={ styles.form }>
                        <View style={ styles.modalHeader }>
                            <Text style={ styles.title }>NEW PLAYLIST</Text>
                            <TouchableHighlight underlayColor="rgba(255,255,255,0.3)" onPress={ () => this.refs.newPlaylistModal.close() }>
                                <Text style={ styles.close }>Close</Text>
                            </TouchableHighlight>
                        </View>
                        <TextInput style={ styles.formInput }
                            ref={ c => this.name = c}
                            autoFocus={ true }
                            autoCapitalize="words"
                            blurOnSubmit={ false }
                            placeholder="playlist name"
                            onChangeText={ newPlaylistName => this.setState({ newPlaylistName }) }
                            onSubmitEditing={ () => this.description.focus() }
                        />
                        <TextInput style={ styles.formInput }
                            ref={ c => this.description = c}
                            autoCapitalize="sentences"
                            placeholder="description"
                            onChangeText={ newPlaylistDescription => this.setState({ newPlaylistDescription }) }
                            onSubmitEditing={ this._onAddPlaylist.bind(this) }
                        />
                        <Button block style={ styles.submit } onPress={ this._onAddPlaylist.bind(this) }>
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
    rightHeaderButton: {
        marginRight: 5,
        padding: 15,
        borderRadius:50,
    },
    modal: { height: 300 },
    form: { margin: 15},
    formInput: { marginTop: 20, borderBottomWidth: 2, borderBottomColor: SCREEN_PLAYLISTS_COLOR},
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: 'center' },
    title: { textAlign: 'center' },
    close: { fontSize: 12, color: '#c1c1c1' },
    submit: { marginTop: 45, backgroundColor: SCREEN_PLAYLISTS_COLOR },
})