import React, { Component } from 'react'
import { StyleSheet, Platform, StatusBar, Alert } from 'react-native'
import { View } from 'native-base'
import { ListItem } from 'react-native-elements'
import ActionButton from 'react-native-action-button'
import Modal from 'react-native-modalbox'

import { MAIN_THEME_COLOR, SCREEN_ALBUMS_COLOR, SCREEN_ALBUMS_DARK_COLOR } from '../../constants'

import FabNavigator from '../FabNavigator'
import InfiniteList from '../InfiniteList'
import AlbumsListItem from './AlbumsListItem'

import { getMMSSFromMillis } from '../../helpers/Functions'

import MusicApi from '../../api/MusicApi'
const musicApi = new MusicApi()

const SCREEN = 'Albums'

export default class AlbumsScreen extends Component {
    static navigationOptions = {
        title: SCREEN,
        headerLeft: null,
        headerTitleStyle : { alignSelf: 'center', color: SCREEN_ALBUMS_COLOR },
        headerStyle: { backgroundColor: MAIN_THEME_COLOR }
    }

    constructor () {
        super()

        this.state = { columns: 1 }
    }

    _handleOnAlbumItemPressed (albumId, albumName) {
        Alert.alert(albumName)
    }

    _renderItem = (item) => (
        <AlbumsListItem
            listItem={ item }
            onItemPressed={ this._handleOnAlbumItemPressed.bind(this) }
        />
    )

    render () {
        const ROWHEIGTH = 80 + 15 + 15 // 80 por Thumbnail large + 2 * (12+3) ListItem paddingVertical        
        const { navigate } = this.props.navigation

        return (
            <View style={ styles.container }>
                {
                    Platform.OS === 'android' && <StatusBar barStyle="light-content" backgroundColor={ SCREEN_ALBUMS_DARK_COLOR } />
                }
                <InfiniteList
                    getData={ musicApi.getAlbums }
                    renderItem={ this._renderItem }
                    rowHeight={ ROWHEIGTH }
                    columns= { this.state.columns }
                    searchHolder='Search for albums ...'
                />
                <FabNavigator current={ SCREEN } navigate={ navigate } />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
})