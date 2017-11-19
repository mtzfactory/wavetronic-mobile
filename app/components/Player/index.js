import React, { Component } from 'react'
import { Platform, Dimensions, StyleSheet, View, Animated, FlatList, TouchableHighlight, ActivityIndicator, Alert } from 'react-native'
import { Text, Button, Icon } from 'native-base'
import { ListItem } from 'react-native-elements'
import Video from 'react-native-video'
import Slider from 'react-native-slider'
import Modal from 'react-native-modalbox'
import _ from 'lodash'

import { PRIMARY_COLOR, STATUSBAR_HEIGHT, HEADER_HEIGHT, PLAYER_HEIGHT } from '../../constants'
import UserApi from '../../api/UserApi'
const userApi = new UserApi()

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')

function getMMSSFromMillis(timeInSeconds) {
    const seconds = Math.floor(timeInSeconds % 60)
    const minutes = Math.floor(timeInSeconds / 60)

    const padWithZero = number => {
        if (number < 10) {
            return `0${ number }`
        }
        return `${ number }`
    }
    return padWithZero(minutes) + ':' + padWithZero(seconds)
}

export default class SongsScreen extends Component {
    constructor () {
        super()

        this.playlists = null
        this.trackIndex = null

        this.state = {
            isVisible: false,
            expanded: false,
            track: {},
            trackHistory: [],
            loading: false,
            playing: false,
            muted: false,
            shuffle: false,
            sliding: false,
            currentTime: 0,
            songDuration: 0,
            animation: new Animated.Value()
        }
    }

    _getRandomSong () {
        return null
    }

    _goBackward () {
        if(this.state.currentTime < 3 && this.state.shuffle )
            this._getRandomSong()
        else
            this.refs.audio.seek(0)

        this.setState({
            currentTime: 0,
        })
    }

    _goForward () {
        this.refs.audio.seek(0)

        this.setState({
            currentTime: 0,
        })

        const songIndex = this.state.shuffle ? this.randomSongIndex() : this.state.songIndex + 1
        
        if (this.state.shuffle) this._getRandomSong()
    }

    _togglePlayer () {
        if (this.state.track.audio)
            this.setState({ playing: !this.state.playing })
    }

    _toggleShuffle () {
        this.setState({ shuffle: !this.state.shuffle })
    }

    _toggleVolume () {
        this.setState({ muted: !this.state.muted })
    }

    _onLoad (params) {
        this.setState({ loading: false, songDuration: params.duration })
    }

    _onProgress (params) {
        if( !this.state.sliding ) {
            this.setState({ currentTime: params.currentTime })
        }
    }

    _onEnd () {
        this.setState({ playing: false, currentTime: 0 })
    }

    _hideMe () {
        if (!this.state.playing)
            this.state.animation.setValue(PLAYER_HEIGHT)
            setTimeout(() => {
                this.setState({ expanded: false, isVisible: false })
            }, 400)
    }

    _onSlidingStart () {
        this.setState({ sliding: true });
      }
    
    _onSlidingChange (value) {
        let newPosition = value * this.state.songDuration;
        this.setState({ currentTime: newPosition });
    }

    _onSlidingComplete () {
        this.refs.audio.seek( this.state.currentTime );
        this.setState({ sliding: false });
    }

    _togglePlaylist () {
        const initialValue = this.state.expanded ? DEVICE_HEIGHT/2 : PLAYER_HEIGHT
        const finalValue = this.state.expanded ? PLAYER_HEIGHT : DEVICE_HEIGHT/2
    
        this.setState({ expanded : !this.state.expanded })
    
        this.state.animation.setValue(initialValue)
        Animated.spring(this.state.animation, { toValue: finalValue }).start()
    }
// SAVE TRACK TO PLAYLIST
    _saveTrackToPlaylist = (playlist) => {
        this.refs.modalWindow.close()
        userApi.saveTrackToPlaylist(playlist, this.state.trackHistory[this.trackIndex].id)
            .catch( error => Alert.alert('Error on save.', error.message))

        this.trackIndex = null
        this.playlists = null
    }

    _renderPlaylistsItem = (item, index) => {
        return <ListItem
            title={ item.name }
            subtitle={ item.description }
            leftIcon={{ name: 'ios-list', type: 'ionicon', style: { color: PRIMARY_COLOR } }}
            key={ item._id }
            onPress={ () => this._saveTrackToPlaylist(item._id) }/>
    }

    _renderPlaylists () {
        return (
            <FlatList
                data={ this.playlists }
                renderItem={ ({item, index}) => this._renderPlaylistsItem(item, index) }
                getItemLayout={ this._getItemLayout }
                keyExtractor={ item => item._id }
            />
        )
    }

    _selectPlaylistToAddTrack(trackIndex) {
        userApi.getAllMyPlaylists()
            .then( res => {
                this.playlists = res.results
                this.trackIndex = trackIndex
                this.refs.modalWindow.open()
            })
    }
// TRACK HISTORY
    _playTrackFromHistory (index) {
        this.setState({ 
            track: this.state.trackHistory[index],
            currentTime: 0,
            playing: true,
            loading: true
        })
    }

    _renderTrackHistoryItem = (item, index) => {
        return <ListItem
            title={ item.name }
            subtitle={ `${item.album_name}, ${item.artist_name}` }
            leftIcon={{ name: 'ios-headset-outline', type: 'ionicon', style: { color: PRIMARY_COLOR } }}
            rightTitle={ getMMSSFromMillis(item.duration) }
            rightIcon={{ name: 'md-add', type: 'ionicon', style: { color: PRIMARY_COLOR, marginLeft: 20 } }}
            onPressRightIcon={ () => this._selectPlaylistToAddTrack(index) }
            key={ item.id }
            onPress={ () => this._playTrackFromHistory(index) }/>
    }

    _renderTrackHistory () {
        return (
            <FlatList
                data={ this.state.trackHistory }
                renderItem={ ({item, index}) => this._renderTrackHistoryItem(item, index) }
                getItemLayout={ this._getItemLayout }
                keyExtractor={ item => item.id }
            />
        )
    }
// COMPONENT LIFE
    componentWillReceiveProps (nextProps) {
        if (nextProps.track.id !== this.state.track.id) {
            if (this.state.playing)
                this._togglePlayer()

            const newTrack = {
                album_name: nextProps.track.album_name,
                artist_name: nextProps.track.artist_name,
                audio: nextProps.track.audio,
                id: nextProps.track.id,
                name: nextProps.track.name,
                duration: nextProps.track.duration
            }

            const newState = { 
                track: nextProps.track,
                currentTime: 0,
                playing: true,
                loading: true,
                isVisible: true
            }

            if (!_.some(this.state.trackHistory, newTrack)) {
                newState.trackHistory = [ newTrack, ... this.state.trackHistory]
            }

            this.setState(newState)
        }
    }

    componentDidMount() {
        this.state.animation.setValue(PLAYER_HEIGHT)
    }

    render () {
        if (!this.state.isVisible && !this.state.playing) {
            return (
                <View style={ styles.opener }>
                    <TouchableHighlight underlayColor="#F1F1F1" onPress={ () => this.setState({ isVisible: true }) }>
                        <Icon name="ios-arrow-dropup"/>
                    </TouchableHighlight>
                </View>
            )
        }

        let songPercentage = 0
        if( this.state.songDuration !== undefined && this.state.songDuration !== 0 ){
            songPercentage = this.state.currentTime / this.state.songDuration
        }

        return (
            <Animated.View style={[ styles.container, { height: this.state.animation } ]}>
                <View style={ styles.playlist }>
                { this.state.expanded && this._renderTrackHistory() }
                </View>
                <Modal style={ styles.modal } position={"bottom"} ref={"modalWindow"}>
                { this.state.expanded && this._renderPlaylists() }
                </Modal>
                <View style={ styles.player }>
                    <Video source={{ uri: this.state.track.audio }}
                        ref="audio"
                        volume={ this.state.muted ? 0 : 1.0 }
                        muted={ false }
                        paused={ !this.state.playing }
                        onLoad={ this._onLoad.bind(this) }
                        onProgress={ this._onProgress.bind(this) }
                        onEnd={ this._onEnd.bind(this) }
                        playInBackground={ true }
                        playWhenInactive={ true }
                        resizeMode="cover"
                        repeat={ false }
                    />
                    <View style={ styles.controls }>
                        <Button transparent style={ styles.noRadius } onPress={ this._goBackward.bind(this) }>
                            <Icon name="ios-arrow-back" />
                        </Button>
                        <Button transparent style={ styles.noRadius } disabled={ this.state.track.name === undefined } onPress={ this._togglePlayer.bind(this) }>
                            { this.state.loading
                                ? <ActivityIndicator size={'small'}/>
                                : <Icon style={ styles.play } name={ this.state.playing ? 'ios-pause' : 'ios-play' } />
                            }
                        </Button>
                        <Button transparent style={ styles.noRadius } onPress={ this._goForward.bind(this) }>
                            <Icon name="ios-arrow-forward" />
                        </Button>
                        <View style={ styles.sliderContainer }>
                            <Text style={[ styles.track, styles.remaining ]}>{ getMMSSFromMillis(this.state.songDuration) }</Text>
                            <Slider
                                onSlidingStart={ this._onSlidingStart.bind(this) }
                                onSlidingComplete={ this._onSlidingComplete.bind(this) }
                                onValueChange={ this._onSlidingChange.bind(this) }
                                minimumTrackTintColor="#851c44"
                                style={ styles.slider }
                                trackStyle={ styles.sliderTrack }
                                thumbStyle={ styles.sliderThumb }
                                value={ songPercentage || 0 }
                            />
                            <Text style={[ styles.track, styles.title ]}>{ this.state.track.name }</Text>
                        </View>
                        <Button transparent style={ styles.noRadius } onPress={ this._toggleVolume.bind(this) }>
                            <Icon name={ this.state.muted ? 'ios-volume-off' : 'ios-volume-up' } />
                        </Button>
                        <Button transparent style={ styles.noRadius } disabled={ this.state.playing } onPress={ this._hideMe.bind(this) }>
                            <Icon name="ios-eye-off"/>
                        </Button>
                        <Button transparent style={ styles.noRadius } disabled={ this.state.loading || this.state.track.name === undefined } onPress={ this._togglePlaylist.bind(this) }>
                            <Icon name={ this.state.expanded ? 'ios-arrow-down' : 'ios-arrow-up' } />
                        </Button>
                    </View>
                </View>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e1e8ee',
        overflow: 'hidden'
    },
    modal: {
        height: DEVICE_HEIGHT / 2 - 80 // giving some top space
    },
    playlist: {
        margin: 10,
        flex: 1,
        backgroundColor: 'transparent'
    },
    opener: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        right:0,
        left:0,
        width: '100%',
        marginBottom: 3 
    },
    player: {
        backgroundColor: '#e1e8ee',
        position: 'absolute',
        bottom: 0,
        right:0,
        left:0,
        width: '100%'
    },
    controls: {
        width: '100%',
        flex: 1,
        flexDirection: 'row'
    },
    noRadius: {
        borderRadius: 0,
    },
    sliderContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        flexGrow: 2,
    },
    slider: {
        height: 15,
    },
    sliderTrack: {
        height: 2,
        backgroundColor: '#333',
    },
    sliderThumb: {
        width: 10,
        height: 10,
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 10 / 2,
        shadowColor: 'red',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 2,
        shadowOpacity: 1,
    },
    track: {
        fontSize: 10,
        fontFamily: 'SpaceMono-Regular.ttf',
        
        includeFontPadding: false,
    },
    title: {
        textAlign: 'center'
    },
    remaining: {
        alignSelf: 'center'
    }
})