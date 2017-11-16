import React, { Component, PureComponent } from 'react'
import { StyleSheet, Platform, StatusBar, View, TouchableHighlight, ImageBackground, Alert } from 'react-native'
import { Content, Text, Button, Icon, Form, Item, Input, Label, Badge } from 'native-base'
import ActionButton from 'react-native-action-button'
import Modal from 'react-native-modalbox'

import { SCREEN_PLAYLISTS_COLOR, SCREEN_PLAYLISTS_DARK_COLOR, API_PAGE_LIMIT } from '../../constants'

import Flickr from '../../helpers/Flickr'
import UserApi from '../../api/UserApi'
import InfiniteList from '../InfiniteList'
import FabNavigator from '../FabNavigator'

const moment = require('moment')
const userApi = new UserApi()
const SCREEN = 'Playlists'
const LANDSCAPE = 'LANDSCAPE'
const PORTRAIT = 'PORTRAIT'

//class PureListItem extends React.PureComponent {
class PureListItem extends PureComponent {
    constructor() {
        super()
        this.state = { image: null }
    }

    _openPlaylist = (id) => {
        //Alert.alert(`${id} was clicked`)
        this.props.onItemPressed(id)
    }

    componentDidMount() {
        Flickr()
            .then( url => this.setState({ image: { uri: url } }))
            .catch(error => {
                this.setState({ image: require('../../assets/images/random-1.png')})
            })
    }

    render() {
        const { listItem, columns } = this.props
        
        const WIDTH = (100 / columns).toFixed(1) + '%'
        const RANDOM_NUMBER = Math.round(Math.random() * 10)

        if (this.state.image === null)
            return null

        return (
          <TouchableHighlight 
            style={{ height: 120, width: WIDTH }}
            underlayColor="#F1F1F1"
            onPress={ () => this._openPlaylist(listItem._id) }>        
              <ImageBackground source={ this.state.image } style={ styles.imagebackground }>
                <View style={ styles.blackOverlay }>
                  <Text style={ [styles.text, styles. name] } numberOfLines={1}>{ listItem.name.toUpperCase() }</Text>
                  <Text style={ [styles.text, styles. description] } numberOfLines={1}>{ listItem.description }</Text>
                  <View style={ styles.row }>
                    <Badge style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}><Text style={ styles.songs }>{ listItem.amount }</Text></Badge>
                    <Text style={ [styles.text, styles.date] }>{ moment(listItem.creation_date).format('MM/YYYY') }</Text>
                  </View>
                </View>
              </ImageBackground>
          </TouchableHighlight>
        )
    }
}

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
                    <Icon name="md-add" style={{ color: "#fff" }}/>
                </TouchableHighlight>,
            headerTitleStyle : { marginLeft: 80, alignSelf: 'center', color: '#fff' },
            headerStyle: { backgroundColor: SCREEN_PLAYLISTS_COLOR }
        }
    }

    constructor() {
        super()

        this.state = {
            localPlaylist: true,
            playlistName: null,
            playlistDescription: null,
            orientation: PORTRAIT,
            columns: 1
        }
    }

    _handleOnItemPressed(id) {
        userApi.getTracksFromPlaylist(id)
            .then(console.log)
            .catch(console.log)
    }

    _renderItem = (item) => (
        <PureListItem
            listItem={ item }
            columns={ this.state.columns }
            onItemPressed={ this._handleOnItemPressed.bind(this) }
        />
    )

    _handleOnLayout(event) {
        const {x, y, width, height} = event.nativeEvent.layout
        if (width > height)
          this.setState({ orientation: LANDSCAPE, columns: 2})
        else
          this.setState({ orientation: PORTRAIT, columns: 1})
    }

    _onAddPlaylist() {
        if (this.state.playlistName && this.state.playlistDescription)
            Promise.resolve()
                .then( () => {
                    return userApi.addPlaylist(this.state.playlistName, this.state.playlistDescription)
                        .then(res => {
                            console.log(res)
                            this.refs.newPlaylistModal.close()
                        })
                        .catch(error => { console.log(error.message) })
                })
                .then(() => this.setState({ playlistName: null, playlistDescription: null }))
    }

    componentDidMount() {
        this.props.navigation.setParams({ handleRightButtonPressed: this.refs.newPlaylistModal.open })
    }

    render() {
        const ROW_HEIGTH = 80 + 15 + 15 // 80 por Thumbnail large + 2 * (12+3) ListItem paddingVertical
        const { navigate } = this.props.navigation

        return (
            <View style={ styles.container } onLayout={ this._handleOnLayout.bind(this) }>
                {
                    Platform.OS === 'android' && <StatusBar barStyle="light-content" backgroundColor={ SCREEN_PLAYLISTS_DARK_COLOR } />
                }
                <InfiniteList
                    getData={ userApi.getPlaylists }
                    renderItem={ this._renderItem }
                    rowHeight={ ROW_HEIGTH }
                    searchHolder='Search for playlists ...'
                    listKey={ this.state.orientation === LANDSCAPE ? 'h' : 'v' }
                    columns={ this.state.columns }
                />
                <FabNavigator current={ SCREEN } navigate={ navigate } />
                <Modal ref={"newPlaylistModal"} style={styles.modal} position={"center"}>
                    <Content>
                        <Text style={{ textAlign: "center", marginTop: 15 }}>New playlist</Text>
                        <Form>
                            <Item floatingLabel success={ this.state.playlistName != null }>
                                <Label>Playlist name</Label>
                                <Input ref={ (c) => this.name = c }
                                    autoFocus={ true }
                                    onChangeText={ playlistName => this.setState({ playlistName }) }
                                    //onSubmitEditing={ () => this.description._root.focus() }
                                />
                            </Item>
                            <Item floatingLabel last success={ this.state.playlistDescription != null }>
                                <Label>Description</Label>
                                <Input ref={ (c) => this.description = c }
                                    onChangeText={ playlistDescription => this.setState({ playlistDescription }) }
                                    onSubmitEditing={ this._onAddPlaylist.bind(this) }
                                />
                            </Item>
                        </Form>
                        <Button block style={ styles.submit } onPress={ this._onAddPlaylist.bind(this) }>
                            <Text>Add</Text>
                        </Button>
                    </Content>
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
    submit: { margin: 15, marginTop: 50 },
    imagebackground: {
        flex: 1,
    },
    blackOverlay: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },
    row: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingBottom: 4,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        paddingTop: 8,
        textAlign: 'center',
        color: '#faebd7',
    },
    name: {
        paddingTop: 10, paddingBottom: 4, fontSize: 18
    },
    description: {
        fontSize: 16, color: '#c1c1c1'
    },
    date: {
        fontSize: 14,
        paddingTop: 0,
        alignSelf: 'center',
    },
    songs: {
        lineHeight: 20,
        fontSize: 12,
    }
})