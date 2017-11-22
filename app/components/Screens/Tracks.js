import React, { Component } from 'react'
import { StyleSheet, Platform, Dimensions, StatusBar } from 'react-native'
import { View, Thumbnail } from 'native-base'
import ActionButton from 'react-native-action-button'
import Modal from 'react-native-modalbox'

import { MAIN_THEME_COLOR, SCREEN_SONGS_COLOR, SCREEN_SONGS_DARK_COLOR } from '../../constants'

import FabNavigator from '../FabNavigator'
import InfiniteList from '../InfiniteList'
import TracksFriendList from './TracksFriendList'
import TracksListItem from './TracksListItem'

import MusicApi from '../../api/MusicApi'
const musicApi = new MusicApi()

const SCREEN = 'Tracks'
const THUMBNAIL_SIZE = 70
const ROW_HEIGTH = THUMBNAIL_SIZE + 17 + 17 // 80 por Thumbnail large + 2 * (12+3) ListItem paddingVertical
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')

export default class TracksScreen extends Component {
    static navigationOptions = {
        title: SCREEN,
        headerLeft: null,
        headerTitleStyle : { alignSelf: 'center', color: SCREEN_SONGS_COLOR },
        headerStyle: { backgroundColor: MAIN_THEME_COLOR }
    }

    constructor () {
        super()

        this.state = {
            trackIndex: null,   // para marcar el listitem de otro color....
            trackId: null,      // jamendo track Id.
            showFriendListModal: false
        }
    }

    _handleOnClosedFriendListModal () {
        this.setState( { showFriendListModal: false })
    }

    _handleOnShareTrack (trackId) {
        this.setState({ showFriendListModal: true, trackId })
        this.refs.friendListModal.open()
    }

    _renderFriendList () {
        return <TracksFriendList trackId={ this.state.trackId } />
    }

    _handleOnPlaySong (trackIndex, track) {
        this.setState({ trackIndex })
        this.props.screenProps.handlePlaySong(track)
    }

    _renderTrackItem = (item, index) => (
        <TracksListItem 
            listItem={ item }
            size={ THUMBNAIL_SIZE }
            index={ index }
            playSong={ this._handleOnPlaySong.bind(this) }
            shareTrack={ this._handleOnShareTrack.bind(this) } />
    )

    render () {
        const { navigate } = this.props.navigation

        return (
            <View style={ styles.container }>
                {
                    Platform.OS === 'android' && <StatusBar barStyle="light-content" backgroundColor={ SCREEN_SONGS_DARK_COLOR } />
                }
                <InfiniteList
                    getData={ musicApi.getTracks }
                    renderItem={ this._renderTrackItem }
                    rowHeight={ ROW_HEIGTH }
                    searchHolder='Search for songs ...'
                />
                <FabNavigator current={ SCREEN } navigate={ navigate } />
                <Modal style={ styles.modal }
                    position={"bottom"} 
                    ref={"friendListModal"}
                    onClosed={ this._handleOnClosedFriendListModal.bind(this) }>
                    { this.state.showFriendListModal && this._renderFriendList() }
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    modal: {
        height: DEVICE_HEIGHT * 0.66 
    },
})
