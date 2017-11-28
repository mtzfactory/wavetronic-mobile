import React, { Component } from 'react'
import { StyleSheet, Dimensions, Platform, StatusBar, View, TouchableHighlight, ImageBackground, Alert } from 'react-native'
import { Button, Text, Icon } from 'native-base'
import Modal from 'react-native-modalbox'
//import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource'

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')
import { LANDSCAPE, PORTRAIT, SPLASH_COLOR, PRIMARY_COLOR, DARK_PRIMARY_COLOR } from './constants'

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

    _handlePlayTrack (track) {
        this.setState({ track })
    }

    _handleCloseNotificationModal () {
        this.setState({ showTrackNotificationModal: false, showFriendRequestNotificationModal: false })
        this.pushService.removeProcessedNotification(this.notificationId)
    }
// FRIEND REQUEST NOTIFICATION
    _handleAcceptFriendRequestNotification() {
        this.notificationModal.close()
        userApi.updateFriendship(this.userId)
            .catch(error => Alert.alert(error.message))
    }

    _renderFriendRequestNotification () {
        console.log('_renderFriendRequestNotification')
        return (
            <View style={[ styles.container, { height: 50, alignItems: "center" } ]}>
                <View style={ styles.header }>
                    <Text style={[ styles.title, styles.titleName ]}>{ this.fromUser }</Text>
                    <Text style={ styles.title }>SEND YOU A FRIEND REQUEST</Text>
                </View>
                <Icon name="ios-contacts-outline" style={{ fontSize: 18, color: "#fff "}}/>
                <TouchableHighlight 
                    style={ styles.submit }
                    underlayColor={ PRIMARY_COLOR + 'AA' }
                    onPress={ this._handleAcceptFriendRequestNotification.bind(this) }>
                    <Text style={ styles.submitText }>YEAH! ACCEPT IT !!</Text>
                </TouchableHighlight>
            </View>
        )
    }

    _handleReceivedFriendRequest ({ fromUser, userId, id }) {
        console.log('_handleReceivedFriendRequest', fromUser, userId, id)
        this.fromUser = fromUser; this.userId = userId, this.notificationId = id
        this.setState({ showFriendRequestNotificationModal: true })
        this.notificationModal.open()
    }
// TRACK NOTIFICATION
    _handlePlayTrackNotification () {
        this.notificationModal.close()
        this.setState({ track: this.track })
    }

    _renderTrackNotification () {
        return (
            <View style={[ styles.container, { alignItems: "center" } ]}>
                <View style={ styles.header }>
                    <Text style={ styles.title }>YOUR FRIEND</Text>
                    <Text style={[ styles.title, styles.titleName ]}>{ this.fromUser }</Text>
                    <Text style={ styles.title }>SEND YOU THIS TRACK</Text>
                </View>
                <ImageBackground style={ styles.imageBackground } source={{ uri: this.track.image }}>
                    <View style={ styles.overlay }>
                        <Text style={ styles.trackTitle }>{ this.track.name.toUpperCase() }</Text>
                        <Text style={ styles.trackInfo }>{ this.track.album_name }</Text>
                        <Text style={ styles.trackInfo }>{ this.track.artist_name }</Text>
                            <TouchableHighlight 
                                style={ styles.submit }
                                underlayColor={ PRIMARY_COLOR + 'AA' }
                                onPress={ this._handlePlayTrackNotification.bind(this) }>
                                <Text style={ styles.submitText }>LET'S PLAY IT !!</Text>
                            </TouchableHighlight>
                    </View>
                </ImageBackground>
            </View>
        )
    }

    _handleReceivedTrack ({ fromUser, track, id }) {
        this.fromUser = fromUser; this.track = JSON.parse(track); this.notificationId = id
        this.setState({ showTrackNotificationModal: true })
        this.notificationModal.open()
    }

    render () {
        const { showTrackNotificationModal, showFriendRequestNotificationModal } = this.state

        return (
            <View style={[ styles.container, { backgroundColor: SPLASH_COLOR + '80' } ]}>
                { Platform.OS === 'ios' && <StatusBar barStyle="default" /> }
                {
                  Platform.OS === 'android' && <StatusBar barStyle="light-content" backgroundColor={ DARK_PRIMARY_COLOR } />
                }
                <RootNavigation 
                    orientation={ this.state.orientation }
                    pnToken={ this.state.pnToken } 
                    handlePlaySong={ this._handlePlayTrack.bind(this) } />
                <Player track={ this.state.track } />
                <PushService ref={c => this.pushService = c }
                    onChangeToken={ pnToken => this.setState({ pnToken }) }
                    onReceivedTrack={ this._handleReceivedTrack.bind(this) }
                    onReceivedFriendRequest={ this._handleReceivedFriendRequest.bind(this) }/>
                <Modal ref={ c => this.notificationModal = c}
                    style={ styles.modal }
                    onClosed={ this._handleCloseNotificationModal.bind(this) }>
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
        height: 300, width: '100%',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    imageBackground: {
        height: 200, width: 200
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-start'
    },
    header: {
        marginBottom: 15,
        alignItems: 'center',
    },
    title: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold'
    },
    titleName: {
        fontSize: 20
    },
    trackTitle: {
        marginTop: 15,
        fontSize: 18,
        color: '#FFF'
    },
    trackInfo: {
        marginTop: 10,
        fontSize: 16,
        color: '#FFFD'
    },
    submit: {
        position: "absolute", 
        bottom: 0,
        width: '100%',
        paddingVertical: 10,
        backgroundColor: PRIMARY_COLOR + '80'
    },
    submitText: {
        textAlign: 'center',
        color: '#FFF'
    }
})