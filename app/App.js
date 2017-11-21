import React, { Component } from 'react'
import { StyleSheet, Platform, StatusBar, View, Image } from 'react-native'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm'
//import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource'

import { LANDSCAPE, PORTRAIT, DARK_PRIMARY_COLOR } from './constants'
import RootNavigation from './components/RootNavigation'
import Player from './components/Player'
import PushController from './helpers/PushController'

export default class App extends Component {
    constructor () {
        super()

        this.state = {
            systemIsReady: true,
            orientation: PORTRAIT,
            pnToken: null,
            song : {}
        }
    }

    _handleOnLayout(event) {
        const {x, y, width, height} = event.nativeEvent.layout
        if (width > height)
          this.setState({ orientation: LANDSCAPE })
        else
          this.setState({ orientation: PORTRAIT })
    }

    _handlePlaySong (song) {
        this.setState({ song })   /// MODIFICAR A TRUE CUANDO FUNCIONE!!!
    }

    render () {
        if (!this.state.systemIsReady) {
            return (
                <View style={ styles.container }>
                    <Text>Loading data...</Text>
                </View>
            )
        }

        return (
            <View style={ styles.container } onLayout={ this._handleOnLayout.bind(this) }>
                { Platform.OS === 'ios' && <StatusBar barStyle="default" /> }
                {
                  Platform.OS === 'android' && <StatusBar barStyle="light-content" backgroundColor={ DARK_PRIMARY_COLOR } />
                }
                <PushController onChangeToken={ pnToken => this.setState({ pnToken }) } />
                <RootNavigation pnToken={ this.state.pnToken } handlePlaySong={ this._handlePlaySong.bind(this) } orientation={ this.state.orientation }/>
                <Player track={ this.state.song } />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    statusBarUnderlay: {
        backgroundColor: DARK_PRIMARY_COLOR,
        height: 24,
    }
})