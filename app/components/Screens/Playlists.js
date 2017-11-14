import React, { Component } from 'react'
import { StyleSheet, Platform, StatusBar, Alert, ImageBackground } from 'react-native'
import { Content, View, ListItem, Left, Right, Body, Thumbnail, Text, Button, Icon, Form, Item, Input, Label } from 'native-base'
import ActionButton from 'react-native-action-button'
import Modal from 'react-native-modalbox'

import { SCREEN_PLAYLISTS_COLOR, SCREEN_PLAYLISTS_DARK_COLOR, API_PAGE_LIMIT } from '../../constants'

//import MusicApi from '../../api/MusicApi'
import UserApi from '../../api/UserApi'
import InfiniteList from '../InfiniteList'
import FabNavigator from '../FabNavigator'

const SCREEN = 'Playlists'
//const musicApi = new MusicApi()
const userApi = new UserApi()

class PureListJamendoItem extends React.PureComponent {
    _openPlaylist = (id) => {
        Alert.alert(`${id} was clicked`)
    }

    render() {
        const { listItem } = this.props

        return (
            <ListItem thumbnail button={true} onPress={ () => this._openPlaylist(listItem.id) }>
                <Body>
                    <Text numberOfLines={ 1 } >{ listItem.name }</Text>
                    <Text numberOfLines={ 1 } note>{ listItem.user_name }</Text>
                    <Text numberOfLines={ 1 } note>{ listItem.creationdate }</Text>
                </Body>
                <Right>
                    <Button transparent>
                        <Text>Open</Text>
                    </Button>
                </Right>
            </ListItem>
        )
    }
}

class PureListItem extends React.PureComponent {
    _openPlaylist = (id) => {
        Alert.alert(`${id} was clicked`)
    }

    render() {
        const { listItem } = this.props
        const flickrPhoto = 'http://farm5.staticflickr.com/4523/24540490088_81cc6eb451_n.jpg'

        return (
            <ListItem thumbnail button={true} onPress={ () => this._openPlaylist(listItem._id) }>
                <ImageBackground source={{uri: flickrPhoto}} style={{ height: 100, width: '100%', flex: 1 }}>
                <Body>
                    <Text numberOfLines={ 1 } >{ listItem.name }</Text>
                    <Text numberOfLines={ 1 } note>{ listItem.amount }</Text>
                    <Text numberOfLines={ 1 } note>{ listItem.creation_date }</Text>
                </Body>
                <Right>
                    <Button transparent>
                        <Text>Open</Text>
                    </Button>
                </Right>
                </ImageBackground>
            </ListItem>
        )
    }
}

export default class PlaylistsScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: SCREEN,
            headerLeft: null,
            headerRight: <Button rounded transparent onPress={ () => 
                navigation.state.params.handleRightButtonPressed() }><Icon name='ios-add-circle-outline'/></Button>,
            headerTitleStyle : { alignSelf: 'center' },
            headerStyle: { backgroundColor: SCREEN_PLAYLISTS_COLOR }
        }
    }

    constructor() {
        super()

        this.state = {
            name: null,
            description: null
        }
    }

    _renderItem = (item) => (
        <PureListItem listItem={ item } />
    )

    componentDidMount() {
        this.props.navigation.setParams({ handleRightButtonPressed: this.refs.newPlaylistModal.open });
    }

    render() {
        const ROWHEIGTH = 80 + 15 + 15 // 80 por Thumbnail large + 2 * (12+3) ListItem paddingVertical
        const { navigate } = this.props.navigation

        return (
            <View style={ styles.container }>
                {
                    Platform.OS === 'android' && <StatusBar barStyle="light-content" backgroundColor={ SCREEN_PLAYLISTS_DARK_COLOR } />
                }
                <InfiniteList
                    getData={ userApi.getPlaylists } //musicApi.getPlaylists }
                    limit={ API_PAGE_LIMIT }
                    renderItem={ this._renderItem }
                    rowHeight={ ROWHEIGTH }
                    searchHolder='Search for playlists ...'
                    searchIcon='ios-infinite'
                />
                <FabNavigator current={ SCREEN } navigate={ navigate } />
                <Modal ref={"newPlaylistModal"} style={styles.modal} position={"center"}>
                    <Content>
                        <Text style={{ textAlign: "center", marginTop: 15 }}>New playlist</Text>
                        <Form>
                            <Item floatingLabel>
                                <Label>Playlist name</Label>
                                <Input ref={ (c) => this._name = c }
                                    //onSubmitEditing={ () => this._description.focus() }
                                    onChangeText={ name => this.setState({ name }) }
                                />
                            </Item>
                            <Item floatingLabel last>
                                <Label>Description</Label>
                                <Input ref={ (c) => this._description = c }
                                    onChangeText={ description => this.setState({ description }) }
                                />
                            </Item>
                        </Form>
                        <Button block style={ styles.submit } onPress={ () => Alert.alert('pdte de enviar...') }>
                            <Text>Create</Text>
                        </Button>
                    </Content>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    modal: { height: 300 },
    submit: { margin: 15, marginTop: 50 }
})