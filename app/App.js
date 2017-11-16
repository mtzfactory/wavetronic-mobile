import React, { Component } from 'react'
import { StyleSheet, Platform, StatusBar, View, Text, Image } from 'react-native'
//import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource'

import { DARK_PRIMARY_COLOR } from './constants'
import RootNavigation from './components/RootNavigation'
import Player from './components/Player'

export default class App extends Component {
    constructor() {
        super()

        this.state = {
            systemIsReady: true,
            song : {}
        }
    }

    _handlePlaySong(song) {
        this.setState({ song })   /// MODIFICAR A TRUE CUANDO FUNCIONE!!!
    }

    // componentWillMount() {
    //     Image.prefetch('file://./assets/images/splash_screen_2.png')
    // }

    render() {
        if (!this.state.systemIsReady) {
            return (
                <View style={ styles.container }>
                    <Text>Loading data...</Text>
                </View>
            )
        }

        return (
            <View style={ styles.container }>
                { Platform.OS === 'ios' && <StatusBar barStyle="default" /> }
                { /* Platform.OS === 'android' && <View style={ styles.statusBarUnderlay } /> */
                  Platform.OS === 'android' && <StatusBar barStyle="light-content" backgroundColor={ DARK_PRIMARY_COLOR } />
                }
                <RootNavigation handlePlaySong={ this._handlePlaySong.bind(this) } />
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