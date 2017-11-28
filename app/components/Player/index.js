import React, { Component } from 'react'
import { Platform, Dimensions, StyleSheet, Easing, View, Animated, FlatList, TouchableHighlight, ActivityIndicator, Alert } from 'react-native'
import { Text, Button, Icon } from 'native-base'
import { ListItem } from 'react-native-elements'
import Video from 'react-native-video'
import Slider from 'react-native-slider'
import Modal from 'react-native-modalbox'
import _ from 'lodash'

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')
import { MAIN_THEME_COLOR, PRIMARY_COLOR, STATUSBAR_HEIGHT, HEADER_HEIGHT, PLAYER_HEIGHT } from '../../constants'

import InfiniteList from '../InfiniteList'
import { getMMSSFromMillis } from '../../helpers/Functions'

import UserApi from '../../api/UserApi'
const userApi = new UserApi()

const TRACKS_ROW_HEIGHT = 63
const PLAYLISTS_ROW_HEIGHT = 63

export default class Player extends Component {
    constructor () {
        super()

        this.trackIndex = null

        this.state = {
            showOpener: false,
            isVisible: false,
            expanded: false,
            track: {},
            trackHistory: [],
            currentHistoryIndex: 0,
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
    _addTrackToPlaylist = (playlist) => {
        this.refs.modalWindow.close()
        userApi.addTrackToPlaylist(playlist, this.state.trackHistory[this.trackIndex].id)
            .catch( error => Alert.alert('Error on save.', error.message))

        this.trackIndex = null
    }

    _renderPlaylistsItem = (item, index) => {
        return (
            <View style={{ marginHorizontal: 10 }}>
            <ListItem
                title={ item.name }
                subtitle={ item.description }
                leftIcon={{ name: 'ios-infinite', type: 'ionicon', style: { color: PRIMARY_COLOR } }}
                rightTitle={ `${item.amount} tracks` }
                key={ item._id }
                onPress={ () => this._addTrackToPlaylist(item._id) }/>
            </View>
        )
    }

    _renderPlaylists () {
        return (
            <InfiniteList
                getData={ userApi.getPlaylists }
                renderItem={ this._renderPlaylistsItem }
                rowHeight={ PLAYLISTS_ROW_HEIGHT }
                searchHolder='Search for playlists ...'
            />
        )
    }

    _selectPlaylistToAddTrack(trackIndex) {
        this.trackIndex = trackIndex
        this.refs.modalWindow.open()
    }
// TRACK HISTORY
    _playTrackFromHistory (index) {
        this.setState({ 
            track: this.state.trackHistory[index],
            currentHistoryIndex: index,
            currentTime: 0,
            songDuration: 0,
            playing: true,
            loading: true
        })
    }

    _getTrackHistoryItemLayout = (data, index) => {
        return {
            offset: TRACKS_ROW_HEIGHT * index,
            length: TRACKS_ROW_HEIGHT,
            index
        }
    }

    _renderTrackHistoryItem = (item, index) => {
        const LEFT_ICON = this.state.currentHistoryIndex === index ? 'ios-headset-outline' : 'ios-musical-notes-outline'

        return <ListItem
            title={ item.name }
            subtitle={ `${item.album_name}, ${item.artist_name}` }
            leftIcon={{ name: LEFT_ICON, type: 'ionicon', style: { color: PRIMARY_COLOR } }}
            rightTitle={ getMMSSFromMillis(item.duration) }
            rightIcon={{ name: 'md-add', type: 'ionicon', style: { color: PRIMARY_COLOR, marginLeft: 15 } }}
            onPressRightIcon={ () => this._selectPlaylistToAddTrack(index) }
            key={ item.id }
            onPress={ () => this._playTrackFromHistory(index) }/>
    }

    _renderTrackHistory () {
        return (
            <FlatList
                data={ this.state.trackHistory }
                extraData={ this.state.currentHistoryIndex }
                renderItem={ ({item, index}) => this._renderTrackHistoryItem(item, index) }
                getItemLayout={ this._getTrackHistoryItemLayout }
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
                currentHistoryIndex: 0,
                currentTime: 0,
                playing: true,
                loading: true,
                isVisible: true,
                showOpener: true,
                songDuration: 0
            }

            const index = _.findIndex(this.state.trackHistory, newTrack)
            if (index === -1) {
                newState.trackHistory = [ newTrack, ... this.state.trackHistory]
            }
            else {
                newState.currentHistoryIndex = index
            }

            this.setState(newState)
        }
    }

    componentDidMount() {
        this.state.animation.setValue(PLAYER_HEIGHT)
    }

    render () {
        if(!this.state.showOpener) {
            return null
        }

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

        const EN_BACKWARD = !this.state.shuffle || this.state.currentHistoryIndex !== 0
        const EN_FOREWARD = !this.state.shuffle || this.state.currentHistoryIndex < this.state.trackHistory.length
        const MUTE_ICON = this.state.muted ? 'ios-volume-off' : 'ios-volume-up'
        const EN_SHOW_PLAYER = this.state.playing
        const EN_SHOW_PLAYLIST = !this.state.expanded && this.state.track.name === undefined //(this.state.loading || this.state.track.name === undefined)

        return (
            <Animated.View style={[ styles.container, { height: this.state.animation } ]}>
                <View style={ styles.playlist }>
                    { this.state.expanded && this._renderTrackHistory() }
                </View>
                <Modal ref={"modalWindow"} 
                    style={ styles.modal }
                    position={"bottom"} easing={Easing.ease}
                    backButtonClose={true}>
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
                        <Button transparent style={ styles.noRadius } disabled={ EN_BACKWARD } onPress={ this._goBackward.bind(this) }>
                            <Icon name="ios-arrow-back" />
                        </Button>
                        <Button transparent style={ styles.noRadius } disabled={ this.state.track.name === undefined } onPress={ this._togglePlayer.bind(this) }>
                            { this.state.loading
                                ? <ActivityIndicator size={'small'} style={{ width: 44 }}/>
                                : <Icon style={ styles.play } name={ this.state.playing ? 'ios-pause' : 'ios-play' } />
                            }
                        </Button>
                        <Button transparent style={ styles.noRadius } disabled={ EN_FOREWARD } onPress={ this._goForward.bind(this) }>
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
                            <Text style={[ styles.track, styles.title ]} numberOfLines={1}>{ this.state.track.name }</Text>
                        </View>
                        <Button transparent style={ styles.noRadius } onPress={ this._toggleVolume.bind(this) }>
                            <Icon name={ MUTE_ICON } />
                        </Button>
                        <Button transparent style={ styles.noRadius } disabled={ EN_SHOW_PLAYER } onPress={ this._hideMe.bind(this) }>
                            <Icon name="ios-eye-off"/>
                        </Button>
                        <Button transparent style={ styles.noRadius } disabled={ EN_SHOW_PLAYLIST } onPress={ this._togglePlaylist.bind(this) }>
                            <Icon name={ this.state.expanded ? 'ios-arrow-down' : 'ios-arrow-up' } />
                        </Button>
                    </View>
                </View>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
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
    container: {
        backgroundColor: '#e1e8ee',
        overflow: 'hidden',
        width: DEVICE_WIDTH,
        maxWidth: DEVICE_WIDTH
    },
    playlist: {
        flex: 1,
        margin: 10,
        marginBottom: 50,
        backgroundColor: 'transparent'
    },
    modal: {
        height: DEVICE_HEIGHT / 2 - 80, // giving some top space
    },
    player: {
        position: 'absolute',
        bottom: 0,
        right:0,
        left:0,
        backgroundColor: MAIN_THEME_COLOR,
    },
    controls: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: DEVICE_WIDTH,
    },
    noRadius: {
        borderRadius: 0,
    },
    sliderContainer: {
        flexGrow: 2,
        flex: -1,   // When flex is -1, the component is normally sized according width and height. However, if there's not enough space, the component will shrink to its minWidth and minHeight.
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        marginLeft: 5,
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