import React, { Component } from 'react'
import { StyleSheet, Dimensions, Platform, StatusBar, View, TouchableHighlight, ImageBackground, Alert } from 'react-native'
import { Button, Text } from 'native-base'
import Modal from 'react-native-modalbox'
//import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource'

import { LANDSCAPE, PORTRAIT, PRIMARY_COLOR, DARK_PRIMARY_COLOR } from './constants'
import RootNavigation from './components/RootNavigation'
import PushService from './services/PushService'
import Player from './components/Player'

import { SPLASH_COLOR } from './constants'

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')

export default class App extends Component {
    constructor () {
        super()

        this.state = {
            orientation: PORTRAIT,
            pnToken: null,
            showkNotificationModal: false,
            track : {}
        }
    }

    // _handleOnLayout(event) {
    //     const {x, y, width, height} = event.nativeEvent.layout
    //     if (width > height)
    //       this.setState({ orientation: LANDSCAPE })
    //     else
    //       this.setState({ orientation: PORTRAIT })
    // }

    _handlePlayTrack (track) {
        this.setState({ track })
    }

    _handlePlayNotificationTrack () {
        this.refs.notificationModal.close()
        this.setState({ track: this.track })
    }

    _handleClosedNotificationModal () {
        this.setState({ showkNotificationModal: false })
        this.pushService.removeProcessedNotification(this.notificationId)
    }

    _renderNotificationTrack () {
        return (
            <View style={[ styles.container, { alignItems: 'center' } ]}>
                <View style={ styles.header }>
                    <Text style={ styles.title }>YOUR FRIEND</Text>
                    <Text style={[ styles.title, styles.titleName ]}>{ this.friend.toUpperCase() }</Text>
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
                                onPress={ this._handlePlayNotificationTrack.bind(this) }>
                                <Text style={ styles.submitText }>LET'S PLAY IT !!</Text>
                            </TouchableHighlight>
                    </View>
                </ImageBackground>
            </View>
        )
    }

    _handleNotificationReceived (friend, track, notificationId) {
        this.friend = friend
        this.track = track
        this.notificationId = notificationId
        this.setState({ showkNotificationModal: true })
        this.refs.notificationModal.open()
    }

    render () {
        return (
            <View style={ styles.container }>
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
                    onNotificationReceived={ this._handleNotificationReceived.bind(this) } />
                <Modal ref={"notificationModal"}
                    style={ styles.modal }
                    onClosed={ this._handleClosedNotificationModal.bind(this) }>
                    { this.state.showkNotificationModal && this._renderNotificationTrack() }
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: SPLASH_COLOR + '80',
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