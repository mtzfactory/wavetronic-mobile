import React, { Component } from 'react'
import { StyleSheet, View, TouchableHighlight, ImageBackground } from 'react-native'
import { Text, Badge } from 'native-base'

import { SCREEN_PLAYLISTS_COLOR } from '../../constants'
import Flickr from '../../helpers/Flickr'

const moment = require('moment')

export default class PlaylistsListItem extends React.PureComponent {
    constructor () {
        super()
        this.state = { image: null }
    }

    _openPlaylist = (id, name) => {
        this.props.onItemPressed(id, name)
    }

    componentDidMount () {
        Flickr()
            .then( url => this.setState({ image: { uri: url } }))
            .catch(error => {
                this.setState({ image: require('../../assets/images/random-1.png')})
            })
    }

    render () {
        const { listItem, columns } = this.props
        
        const WIDTH = (100 / columns).toFixed(1) + '%'
        const RANDOM_NUMBER = Math.round(Math.random() * 10)

        const BADGE_COLOR = listItem.amount > 0 
            ? { backgroundColor: SCREEN_PLAYLISTS_COLOR + '80' } //'rgba(255, 215, 0, 0.5)' }
            : { backgroundColor: 'rgba(255, 255, 255, 0.4)' }

        return (
          <TouchableHighlight disabled={ listItem.amount === 0 }
            style={{ height: 120, width: WIDTH }}
            underlayColor="#F1F1F1"
            onPress={ () => this._openPlaylist(listItem._id, listItem.name) }>        
              <ImageBackground source={ this.state.image } style={ styles.imagebackground }>
                <View style={ styles.blackOverlay }>
                  <Text style={ [styles.text, styles.name] } numberOfLines={1}>{ listItem.name.toUpperCase() }</Text>
                  <Text style={ [styles.text, styles.description] } numberOfLines={1}>{ listItem.description }</Text>
                  <View style={ styles.row }>
                    <Badge style={ BADGE_COLOR }><Text style={ styles.songs }>{ listItem.amount }</Text></Badge>
                    <Text style={ [styles.text, styles.date] }>{ moment(listItem.creation_date).format('MM/YYYY') }</Text>
                  </View>
                </View>
              </ImageBackground>
          </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    imagebackground: {
        flex: 1,
    },
    blackOverlay: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },
    row: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingBottom: 6,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        paddingTop: 8,
        textAlign: 'center',
        color: '#faebd7',
    },
    name: {
        paddingTop: 10, paddingBottom: 4, fontSize: 18
    },
    description: {
        fontSize: 16, color: '#c1c1c1'
    },
    date: {
        fontSize: 12,
        paddingTop: 0,
        alignSelf: 'center',
        color: '#c1c1c1'
    },
    songs: {
        lineHeight: 20,
        fontSize: 12,
    }
})