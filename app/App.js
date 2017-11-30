import React, { Component } from 'react'
import { StyleSheet, Dimensions, Platform, StatusBar, View, TouchableHighlight, ImageBackground, Alert } from 'react-native'
import { Button, Text, Icon } from 'native-base'
import Modal from 'react-native-modalbox'
//import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource'

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')
import { SPLASH_COLOR, POSITIVE, NEGATIVE, PRIMARY_COLOR, DARK_PRIMARY_COLOR } from './constants'

import RootNavigation from './components/RootNavigation'
import PushService from './services/PushService'
import Player from './components/Player'

import UserApi from './api/UserApi'
const userApi = new UserApi()

export default class App extends Component {
    constructor () {
        super()

        this.state = {
            pnToken: null,
            track : {},
            showTrackNotificationModal: false,
            showFriendRequestNotificationModal: false
        }
    }

    _handlePlayTrack = (track) => {
        this.setState({ track })
    }

    _handleCloseNotificationModal = () => {
        this.setState({ showTrackNotificationModal: false, showFriendRequestNotificationModal: false })
        this.pushService.removeProcessedNotification(this.notificationId)
    }
// FRIEND REQUEST NOTIFICATION
    _handleAcceptFriendRequestNotification = () => {
        this.notificationModal.close()
        userApi.updateFriendship(this.userId)
            .catch(error => Alert.alert(error.message))
    }

    _renderFriendRequestNotification () {
        return (
            <View style={[ styles.container, styles.modalContainer ]}>
                <Icon name="ios-contacts-outline" style={{ fontSize: 38, color: "#fff8"}}/>
                <View style={ styles.header }>
                    <Text style={ styles.headerTitle }>NEW FRIEND REQUEST FROM</Text>
                    <Text style={[ styles.headerTitle, styles.headerUsername ]}>{ this.fromUser }</Text>
                </View>
                <View style={ styles.footer }>
                    <TouchableHighlight 
                        style={[ styles.submit, { backgroundColor: POSITIVE + 'B0' } ]}
                        underlayColor={ POSITIVE + 'AA' }
                        onPress={ this._handleAcceptFriendRequestNotification }>
                        <Text style={ styles.submitText }>YEAH! ACCEPT IT !!</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        style={[ styles.submit, { backgroundColor: NEGATIVE + 'B0' } ]}
                        underlayColor={ NEGATIVE + 'AA' }
                        onPress={ this.notificationModal.close }>
                        <Text style={ styles.submitText }>NOT NOW</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }

    _handleReceivedFriendRequest = ({ fromUser, userId, id }) => {
        this.fromUser = fromUser; this.userId = userId, this.notificationId = id
        this.setState({ showFriendRequestNotificationModal: true })
        this.notificationModal.open()
    }
// TRACK NOTIFICATION
    _handlePlayTrackNotification = () => {
        this.notificationModal.close()
        this.setState({ track: this.track })
    }

    _renderTrackNotification () {
        return (
            <View style={[ styles.container, styles.modalContainer ]}>
                <View style={ styles.header }>
                    <Text style={ styles.headerTitle }>YOUR FRIEND</Text>
                    <Text style={[ styles.headerTitle, styles.headerUsername ]}>{ this.fromUser }</Text>
                    <Text style={ styles.headerTitle }>SEND YOU THIS TRACK</Text>
                </View>
                <ImageBackground style={ styles.imageBackground } source={{ uri: this.track.image }}>
                    <View style={ styles.overlay }>
                        <Text style={ styles.trackTitle }>{ this.track.name.toUpperCase() }</Text>
                        <Text style={ styles.trackInfo }>{ this.track.album_name }</Text>
                        <Text style={ styles.trackInfo }>{ this.track.artist_name }</Text>
                    </View>
                </ImageBackground>
                <View style={ styles.footer }>
                    <TouchableHighlight 
                        style={[ styles.submit, { backgroundColor: POSITIVE + 'B0' } ]}
                        underlayColor={ POSITIVE + 'AA' }
                        onPress={ this._handlePlayTrackNotification }>
                        <Text style={ styles.submitText }>LET'S PLAY IT !!</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        style={[ styles.submit, { backgroundColor: NEGATIVE + 'B0' } ]}
                        underlayColor={ NEGATIVE + 'AA' }
                        onPress={ this.notificationModal.close }>
                        <Text style={ styles.submitText }>NOT NOW</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }

    _handleReceivedTrack = ({ fromUser, track, id }) => {
        this.fromUser = fromUser; this.track = JSON.parse(track); this.notificationId = id
        this.setState({ showTrackNotificationModal: true })
        this.notificationModal.open()
    }
// COMPONENT LIFE
    render () {
        const { showTrackNotificationModal, showFriendRequestNotificationModal } = this.state
        const MODAL_HEIGHT = showTrackNotificationModal ? 380 : 200

        return (
            <View style={[ styles.container, { backgroundColor: SPLASH_COLOR + '80' } ]}>
                { Platform.OS === 'ios' && <StatusBar barStyle="default" /> }
                {
                  Platform.OS === 'android' && <StatusBar barStyle="light-content" backgroundColor={ DARK_PRIMARY_COLOR } />
                }
                <RootNavigation 
                    orientation={ this.state.orientation }
                    pnToken={ this.state.pnToken } 
                    handlePlaySong={ this._handlePlayTrack } />
                <Player track={ this.state.track } />
                <PushService ref={c => this.pushService = c }
                    onChangeToken={ pnToken => this.setState({ pnToken }) }
                    onReceivedTrack={ this._handleReceivedTrack }
                    onReceivedFriendRequest={ this._handleReceivedFriendRequest }/>
                <Modal ref={ c => this.notificationModal = c}
                    style={[ styles.modal, { height: MODAL_HEIGHT } ]}
                    backButtonClose={ true }
                    onClosed={ this._handleCloseNotificationModal }>
                    { showTrackNotificationModal && this._renderTrackNotification() }
                    { showFriendRequestNotificationModal && this._renderFriendRequestNotification()}
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    statusBarUnderlay: {
        height: 24,
        backgroundColor: DARK_PRIMARY_COLOR,
    },
    modal: {
        width: '80%',
        padding: 15,
        alignItems: 'center',
        backgroundColor: '#120D0D'
    },
    modalContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
    imageBackground: {
        height: 200, width: 200,
    },
    overlay: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    header: {
        //marginBottom: 15,
        alignItems: 'center',
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    headerUsername: {
        marginVertical: 8,
        fontSize: 20
    },
    trackTitle: {
        textAlign: 'center',
        fontSize: 18,
        color: '#FFF'
    },
    trackInfo: {
        textAlign: 'center',
        fontSize: 16,
        color: '#FFFD'
    },
    footer: {
        //marginTop: 15,
        flexDirection: 'row'
    },
    submit: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    submitText: {
        textAlign: 'center',
        color: '#FFF'
    }
})