import React, { Component } from 'react'
import { StyleSheet, Platform, Dimensions, StatusBar, Easing, View, TouchableHighlight, TouchableOpacity, TextInput, Alert } from 'react-native'
import { Text, Button, Icon } from 'native-base'
import { ListItem } from 'react-native-elements'
import Modal from 'react-native-modalbox'
import { NavigationActions } from 'react-navigation'

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')
import { API_PAGE_LIMIT, MAIN_THEME_COLOR, SCREEN_CONTACTS_COLOR, SCREEN_CONTACTS_DARK_COLOR } from '../../constants'

import TokenService from '../../services/TokenService'
import FabNavigator from '../FabNavigator'
import InfiniteList from '../InfiniteList'
import ContactsListItem from './ContactsListItem'

import UserApi from '../../api/UserApi'
const userApi = new UserApi()

const CONTACTS_ROW_HEIGTH = 63
const SCREEN = 'Contacts'

export default class ContactsScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: SCREEN,
            headerLeft: (
                <TouchableHighlight 
                    underlayColor="rgba(255,255,255,0.4)"
                    style={ styles.rightHeaderButton}
                    onPress={ () => 
                        navigation.state.params.handleLeftButtonPressed()
                    }>
                        <Icon name="ios-sad-outline" style={{ color: SCREEN_CONTACTS_COLOR }}/>
                </TouchableHighlight>
            ),
            headerRight: (
                <TouchableHighlight 
                    underlayColor="rgba(255,255,255,0.4)"
                    style={ styles.rightHeaderButton}
                    onPress={ () => 
                        navigation.state.params.handleRightButtonPressed()
                    }>
                        <Icon name="md-add" style={{ color: SCREEN_CONTACTS_COLOR }}/>
                </TouchableHighlight>
            ),
            headerTitleStyle : { alignSelf: 'center', color: SCREEN_CONTACTS_COLOR },
            headerStyle: { backgroundColor: MAIN_THEME_COLOR }
        }
    }

    constructor () {
        super()

        this.state = { newContactName: null, friendId: null, friendName: null }
    }
// LOG OUT
    _navigate = (page, params) => {
        // Route with disabled back functionality
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ 
                    routeName: page,
                    params
                }),
            ],
        })
        this.props.navigation.dispatch(resetAction)
    }

    _doLogout = () => {
        userApi.doLogout()
            .then(() =>{
                TokenService.removeToken()
                TokenService.get().deleteToken()
                this._navigate('Login', { type: 'Login', next:'Sign up', text: 'Don\'t have an account yet?' })
            })
            .catch(error => Alert.alert(error.message))
    }

// NEW CONTACT MODAL
    _addContact () {
        const { newContactName } = this.state

        if (newContactName)
            userApi.addFriend(newContactName)
                .then(res => {
                    this.refs.newContactModal.close()
                    this.setState({ newContactName: null })
                    this.contactsRef._handleRefresh()
                })
                .catch(error => { Alert.alert(error.message) })
    }
// SWIPE RIGHT
    _handleOnContactsItemRightSwipe (item, index) {
        let doSomething = null; let data = null
        if (item.confirmed === undefined){
            console.log('ContactsScreen addFriend:', item.username)
            doSomething = userApi.addFriend
            data = item.username
        }
        else {
            doSomething = userApi.removeFriend
            console.log('ContactsScreen removeFriend:', item._id)
            data = item._id
        }

        doSomething(data).then(
            this.contactsRef._handleRefresh()
        )
        .catch(error => { Alert.alert(error.message) })
    }

    _renderRightSwipeContactsItem = (item, index) => {
        const ICON = item.confirmed === undefined ? 'ios-add' : 'ios-trash-outline'
        return (
            <TouchableOpacity style={{ height: CONTACTS_ROW_HEIGTH, width: CONTACTS_ROW_HEIGTH, }} onPress={ () => this._handleOnContactsItemRightSwipe(item, index) }>
                <View style={{ backgroundColor: SCREEN_CONTACTS_COLOR + 'D0', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name={ ICON } style={{ color: "#fff" }}/>
                </View>
            </TouchableOpacity>
        )
    }
// RENDER CONTACTS ITEM
    _sendFriendship () {
        const { friendName } = this.state

        if (friendName)
            userApi.addFriend(friendName)
                .then(res => {
                    this.refs.sendFriendshipModal.close()
                    this.setState({ friendId: null, friendName: null })
                })
                .catch(error => { Alert.alert(error.message) })
    }

    _handleOnContactsItemPressed (friendId, friendName) {
        this.setState({ friendId, friendName })
        this.refs.sendFriendshipModal.open()
    }

    _renderContactsItem = (item, index) => (
        <ContactsListItem style={{ height: CONTACTS_ROW_HEIGTH }}
            item={ item }
            onPressItem={ this._handleOnContactsItemPressed.bind(this) }
        />
    )
// COMPONENT LIFE
    componentDidMount () {
        this.props.navigation.setParams({ handleRightButtonPressed: this.refs.newContactModal.open })
        this.props.navigation.setParams({ handleLeftButtonPressed: this._doLogout })
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
                    ref={ c => this.contactsRef = c }
                    getData={ userApi.getFriends }
                    limit={ API_PAGE_LIMIT }
                    renderItem={ this._renderContactsItem }
                    rowHeight={ CONTACTS_ROW_HEIGTH }
                    searchHolder='Search for friends ...'
                    enableSwipe={true}
                    renderRight={ this._renderRightSwipeContactsItem }
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