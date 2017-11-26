import React, { Component } from 'react'
import { StyleSheet, Platform, Dimensions, StatusBar, Easing, View, TouchableHighlight, TextInput, Alert } from 'react-native'
import { Text, Button, Icon } from 'native-base'
import { ListItem } from 'react-native-elements'
import ActionButton from 'react-native-action-button'
import Modal from 'react-native-modalbox'

import { MAIN_THEME_COLOR, SCREEN_CONTACTS_COLOR, SCREEN_CONTACTS_DARK_COLOR } from '../../constants'

import FabNavigator from '../FabNavigator'
import InfiniteList from '../InfiniteList'
import ContactsListItem from './ContactsListItem'

import UserApi from '../../api/UserApi'
const userApi = new UserApi()

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')
const CONTACTS_ROW_HEIGTH = 63
const SCREEN = 'Contacts'

export default class ContactsScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: SCREEN,
            headerLeft: null,
            headerRight: (
                <TouchableHighlight 
                    underlayColor="rgba(255,255,255,0.3)"
                    style={ styles.rightHeaderButton}
                    onPress={ () => 
                        navigation.state.params.handleRightButtonPressed()
                    }>
                        <Icon name="md-add" style={{ color: SCREEN_CONTACTS_COLOR }}/>
                </TouchableHighlight>
            ),
            headerTitleStyle : { marginLeft: 80, alignSelf: 'center', color: SCREEN_CONTACTS_COLOR },
            headerStyle: { backgroundColor: MAIN_THEME_COLOR }
        }
    }

    constructor () {
        super()

        this.state = { newContactName: null, friendId: null, friendName: null }
    }

    _sendFriendship () {
        this.setState({ friendId: null, friendName: null })
        this.refs.sendFriendshipModal.close()
        Alert.alert('Ups... Not implemented yet')
    }

    _addContact () {
        const { newContactName } = this.state

        if (newContactName)
            userApi.addFriend(newContactName)
                .then(res => {
                    this.refs.newPlaylistModal.close()
                    this.setState({ newContactName: null })
                })
                .catch(error => { Alert.alert(error.message) })

    }

    _handleOnContactsItemPressed (friendId, friendName) {
        this.setState({ friendId, friendName })
        this.refs.sendFriendshipModal.open()
    }

    _rendeContactsItem = (item, index) => (
        <ContactsListItem
            listItem={ item }
            onItemPressed={ this._handleOnContactsItemPressed.bind(this) }
        />
    )

    componentDidMount () {
        this.props.navigation.setParams({ handleRightButtonPressed: this.refs.newContactModal.open })
    }

    render() {
        const { navigate, state: { params } } = this.props.navigation
        const { newContactName, friendName } = this.state

        const BUTTON_DISABLED = newContactName === null
        const BUTTON_COLOR = { backgroundColor: BUTTON_DISABLED ? '#c9c9c9' : SCREEN_CONTACTS_COLOR }

        return (
            <View style={ styles.container }>
                {
                    Platform.OS === 'android' && <StatusBar barStyle="light-content" backgroundColor={ SCREEN_CONTACTS_DARK_COLOR } />
                }
                <InfiniteList
                    getData={ userApi.getFriends }
                    renderItem={ this._rendeContactsItem }
                    rowHeight={ CONTACTS_ROW_HEIGTH }
                    searchHolder='Search for friends ...'
                />
                <Modal ref={"newContactModal"}
                    style={ styles.modal }
                    position={"center"} entry={"top"} easing={Easing.ease}
                    backButtonClose={true}>
                    <View style={ styles.formModal }>
                        <View style={ styles.headerModal }>
                            <Text style={ styles.titleHeader }>NEW CONTACT</Text>
                            <TouchableHighlight underlayColor="rgba(255,255,255,0.3)" onPress={ () => this.refs.newContactModal.close() }>
                                <Text style={ styles.textHeader }>Close</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={{ flex: 2 }}>
                        <TextInput style={ styles.inputForm }
                            ref={ c => this.name = c}
                            autoFocus={ true }
                            autoCapitalize="none"
                            blurOnSubmit={ true }
                            placeholder="your friend's username"
                            onChangeText={ newContactName => this.setState({ newContactName }) }
                        />
                        </View>
                        <Button block style={[ styles.submit, BUTTON_COLOR ]} disabled={ BUTTON_DISABLED } onPress={ this._addContact.bind(this) }>
                            <Text>Add</Text>
                        </Button>
                    </View>
                </Modal>
                <Modal ref={"sendFriendshipModal"}
                    style={ styles.modal }
                    position={"center"} entry={"bottom"} easing={Easing.ease}
                    backButtonClose={true}>
                    <View style={ styles.formModal }>
                        <View style={ styles.headerModal }>
                            <Text style={ styles.titleHeader }>FRIENDSHIP</Text>
                            <TouchableHighlight underlayColor="rgba(255,255,255,0.3)" onPress={ () => this.refs.sendFriendshipModal.close() }>
                                <Text style={ styles.textHeader }>Close</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={{ flex: 2, flexDirection:"column", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ marginTop: 0 }}>Your friend hasn't confirmed yet!</Text>
                            <Text style={{ marginTop: 15 }}>Send another friend request to:</Text>
                            <Text style={{ marginTop: 15, fontSize: 20, fontWeight: 'bold' }}>{friendName}</Text>
                        </View>
                        <Button block style={ styles.submit } onPress={ this._sendFriendship.bind(this) }>
                                <Text>Yeah! Ask him again!</Text>
                        </Button>
                    </View>
                </Modal>
                <FabNavigator current={ SCREEN } navigate={ navigate } />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    rightHeaderButton: { marginRight: 5, padding: 15, borderRadius:50, },
    modal: { height: DEVICE_HEIGHT / 2, backgroundColor: '#fff' },
    formModal: { margin: 25, flex: 1, flexDirection: 'column' },
    headerModal: { flex: -1, flexDirection: "row", justifyContent: "space-between", alignItems: 'center' },
    titleHeader: { textAlign: 'center', color: SCREEN_CONTACTS_DARK_COLOR },
    textHeader: { fontSize: 12, color: SCREEN_CONTACTS_COLOR + '80' },
    inputForm: { marginTop: 15, borderBottomWidth: 2, borderBottomColor: SCREEN_CONTACTS_COLOR },
    submit: { marginTop: 35, backgroundColor: SCREEN_CONTACTS_COLOR },
})