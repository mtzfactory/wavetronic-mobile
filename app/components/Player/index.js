import React, { Component } from 'react'
import { Platform, Dimensions, StyleSheet, UIManager, LayoutAnimation, FlatList, Alert } from 'react-native'
import { View, ListItem, Left, Right, Body, Thumbnail, Text, Button, Icon } from 'native-base'
import Video from 'react-native-video'
import Slider from 'react-native-slider'
import _ from 'lodash'

import { PRIMARY_COLOR, STATUSBAR_HEIGHT, HEADER_HEIGHT, PLAYER_HEIGHT } from '../../constants'

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
    constructor() {
        super()

        this.state = {
            isVisible: false,
            showPlaylist: false,
            song: {},
            //songs: [],
            playing: false,
            muted: false,
            shuffle: false,
            sliding: false,
            currentTime: 0,
            songDuration: 0
        }

        this.songs = []
    }

    _getRandomSong() {
        //this.props.getRandomSong()
        return null
    }

    _goBackward() {
        if(this.state.currentTime < 3 && this.state.shuffle )
            this._getRandomSong()
        else
            this.refs.audio.seek(0)

        this.setState({
            currentTime: 0,
        })
    }

    _goForward() {
        this.refs.audio.seek(0)

        this.setState({
            //songIndex: this.state.shuffle ? this.randomSongIndex() : this.state.songIndex + 1,
            currentTime: 0,
        })
        
        if (this.state.shuffle) this._getRandomSong()
    }

    _togglePlay() {
        this.setState({ playing: !this.state.playing })
    }

    _toggleShuffle() {
        this.setState({ shuffle: !this.state.shuffle })
    }

    _toggleVolume() {
        this.setState({ muted: !this.state.muted })
    }

    _onLoad(params) {
        this.setState({ songDuration: params.duration })
    }

    _onProgress(params) {
        if( !this.state.sliding ) {
            this.setState({ currentTime: params.currentTime })
        }
    }

    _onEnd() {
        this.setState({ playing: false, currentTime: 0 })
    }

    _hideMe() {
        if (!this.state.playing)
            setTimeout(() => {
                this.setState({ isVisible: false })
            }, 400)
    }

    _onSlidingStart() {
        this.setState({ sliding: true });
      }
    
    _onSlidingChange(value) {
        let newPosition = value * this.state.songDuration;
        this.setState({ currentTime: newPosition });
    }

    _onSlidingComplete() {
        this.refs.audio.seek( this.state.currentTime );
        this.setState({ sliding: false });
    }

    _togglePlaylist() {
        if (this.state.showPlaylist) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
        }
        
        this.setState({ showPlaylist: !this.state.showPlaylist })
    }

    _renderPlaylist() {
        return (
            <FlatList
                data={ this.songs }
                renderItem={ ({item}) => <Text>{item.name}</Text> }
                keyExtractor={ item => item.id }
                getItemLayout={ this._getItemLayout }
            />
        )
    }

    _addNewSongToPlaylist = song => {
        const miniSong = {
            album_id: song.album_id,
            album_name: song.album_name,
            artist_name: song.artist_name,
            audio: song.audio,
            id: song.id,
            image: song.image,
            name: song.name
        }

        if (!_.some(this.songs, miniSong)) {
            //this.songs = [miniSong, ...this.songs]
            this.songs.unshift(miniSong)
            console.log(this.songs)
        }
    }

    componentDidMount() {
        if (Platform.OS === 'android')
            UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.newSong.id !== this.state.song.id) {
            if (this.state.playing)
                this._togglePlay()

            this.setState(prevState => { 
                return {
                    song: nextProps.newSong,
                    //songs: [...prevState.songs, nextProps.newSong],
                    currentTime: 0,
                    playing: true,
                    isVisible: true
                }
            })

            this._addNewSongToPlaylist(nextProps.newSong)
        }
    }

    render() {
        if (!this.state.isVisible && !this.state.playing) {
            return null
        }

        let songPercentage = 0
        if( this.state.songDuration !== undefined && this.state.songDuration !== 0 ){
            songPercentage = this.state.currentTime / this.state.songDuration
        }

        const container = this.state.showPlaylist ? { height: DEVICE_HEIGHT - STATUSBAR_HEIGHT - HEADER_HEIGHT } : { height: PLAYER_HEIGHT }
        const listContainer = this.state.showPlaylist ? { flex: 1 } : {}

        return (
            <View style={ [ container, { backgroundColor: 'seagreen' } ] }>
                <View style={ [ listContainer, { backgroundColor: 'steelblue'} ] }>
                { this.state.showPlaylist && this._renderPlaylist() }
                </View>
                <View style={ styles.playerContainer }>
                    <Video source={{ uri: this.state.song.audio }}
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
                        <Button transparent onPress={ this._goBackward.bind(this) }>
                            <Icon name='ios-arrow-back' />
                        </Button>
                        <Button transparent onPress={ this._togglePlay.bind(this) }>
                            <Icon style={ styles.play } name={ this.state.playing ? 'ios-pause' : 'ios-play' } />
                        </Button>
                        <Button transparent onPress={ this._goForward.bind(this) }>
                            <Icon name='ios-arrow-forward' />
                        </Button>
                        <View style={ styles.sliderContainer }>
                            <Text style={[ styles.song, styles.remaining ]}>{ getMMSSFromMillis(this.state.songDuration) }</Text>
                            <Slider
                                onSlidingStart={ this._onSlidingStart.bind(this) }
                                onSlidingComplete={ this._onSlidingComplete.bind(this) }
                                onValueChange={ this._onSlidingChange.bind(this) }
                                minimumTrackTintColor='#851c44'
                                style={ styles.slider }
                                trackStyle={ styles.sliderTrack }
                                thumbStyle={ styles.sliderThumb }
                                value={ songPercentage || 0 }
                            />
                            <Text style={[ styles.song, styles.title ]}>{ this.state.song.name }</Text>
                        </View>
                        <Button transparent onPress={ this._toggleVolume.bind(this) }>
                            <Icon name={ this.state.muted ? 'ios-volume-off' : 'ios-volume-up' } />
                        </Button>
                        {/* <Button transparent onPress={ this._toggleShuffle.bind(this) }>
                            <Icon name={ this.state.shuffle ? 'ios-shuffle' : 'ios-arrow-round-forward' } />
                        </Button> */}
                        <Button transparent disabled={ this.state.playing } onPress={ this._hideMe.bind(this) }>
                            <Icon name='ios-arrow-down' />
                        </Button>
                        <Button transparent onPress={ this._togglePlaylist.bind(this) }>
                            <Icon name='md-more' />
                        </Button>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    playerContainer: {
        backgroundColor: '#e1e8ee',//'#c8c8c8',
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
        backgroundColor: PRIMARY_COLOR,//'#f62976',
        borderRadius: 10 / 2,
        shadowColor: 'red',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 2,
        shadowOpacity: 1,
    },
    song: {
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