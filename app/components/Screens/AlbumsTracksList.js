import React, { Component } from 'react'
import { StyleSheet, View, FlatList, TouchableHighlight, TouchableOpacity, Alert } from 'react-native'
import { Text, Icon } from 'native-base'
import { ListItem } from 'react-native-elements'

import { API_PAGE_LIMIT, SCREEN_ALBUMS_COLOR } from '../../constants'

import { getMMSSFromMillis } from '../../helpers/Functions'

import MusicApi from '../../api/MusicApi'
const musicApi = new MusicApi()

const TRACKS_ROW_HEIGHT = 63

export default class AlbumsTracksList extends Component {
    constructor () {
        super()

        this.state = { albumsTracks: [], currentTrackIndex: -1 }
    }

    _playAllTracksFromAlbum = () => {
        this.setState({ currentTrackIndex: null }, () => {
            this.props.onClose()
        })
        Alert.alert('play all')
    }

    _playTrackFromAlbum = (index) => {
        this.setState({ currentTrackIndex: index })
        this.props.playTrack(this.state.albumsTracks.tracks[index])
    }

    _getAlbumTracksItemLayout = (data, index) => {
        return {
            offset: TRACKS_ROW_HEIGHT * index,
            length: TRACKS_ROW_HEIGHT,
            index
        }
    }

    _renderAlbumTracksItem = (item, index) => {
        const LEFT_ICON = this.state.currentTrackIndex === index ? 'ios-headset-outline' : 'ios-musical-notes-outline'
        
        return <ListItem
            underlayColor={ SCREEN_ALBUMS_COLOR + '50' }
            title={ `${item.position} - ${item.name}` }
            leftIcon={{ name: LEFT_ICON, type: 'ionicon', style: { color: SCREEN_ALBUMS_COLOR } }}
            rightTitle={ getMMSSFromMillis(item.duration) }
            rightIcon={{ name: 'ios-play-outline', type: 'ionicon', style: { color: SCREEN_ALBUMS_COLOR, marginLeft: 15 } }}
            key={ item.id }
            onPress={ () => this._playTrackFromAlbum(index) }/>
    }

    componentWillMount () {
        musicApi.getTracksFromAlbum(this.props.albumId)
            .then(res => {
                this.setState({ currentTrackIndex: -1, albumsTracks: res.results[0] })
            })
            .catch(error => { Alert.alert(error.message) })
    }

    render () {
        return (
            <View style={{ flex: 1,  padding: 10, backgroundColor: SCREEN_ALBUMS_COLOR + '40' }}>
                <View style={ styles.headerModal }>
                    <TouchableHighlight style={ styles.buttonHeader } underlayColor="rgba(255,255,255,0.3)" onPress={ this._playAllTracksFromAlbum }>
                        <Text style={ styles.textHeader }>Play all</Text>
                    </TouchableHighlight>
                    <Text numberOfLines={ 1 } style={ styles.textAlbum }>{ this.props.albumName.toUpperCase() }</Text>
                    <TouchableHighlight style={ styles.buttonHeader } underlayColor="rgba(255,255,255,0.3)" onPress={ this.props.onClose }>
                        <Text style={ styles.textHeader }>Close</Text>
                    </TouchableHighlight>
                </View>
                <FlatList
                    data={ this.state.albumsTracks.tracks }
                    extraData={ this.state.currentTrackIndex }
                    renderItem={ ({item, index}) => this._renderAlbumTracksItem(item, index) }
                    getItemLayout={ this._getAlbumTracksItemLayout }
                    keyExtractor={ (item, index) => item.id }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerModal: { marginBottom: 2, flexDirection: "row", justifyContent: "space-between", alignItems: 'center' },
    buttonHeader: { height: 20 },
    textHeader: { fontSize: 12, color: SCREEN_ALBUMS_COLOR + '80' },
    textAlbum: { flex: -1, paddingHorizontal: 15, color: '#43484d' },
})