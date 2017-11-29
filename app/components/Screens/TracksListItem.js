import React, { Component } from 'react'
import { StyleSheet, View, ImageBackground, TouchableHighlight } from 'react-native'
import { Text, Icon } from 'native-base'

import { SCREEN_SONGS_COLOR } from '../../constants'

export default class TracksListItem extends React.PureComponent {
    _onPressItem = (index , item) => {
        this.props.playSong(index , item)
    }

    _onRightPressItem = (listItemId) => {
        this.props.shareTrack(listItemId)
    }

    render () {
        const { item, index, size, style } = this.props

        return (
            <View style={{ height: style.height, marginVertical: 5, paddingHorizontal: 10, flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                <TouchableHighlight underlayColor={ SCREEN_SONGS_COLOR + '10' } style={{ flex: 1 }} onPress={ () => this._onPressItem(index , item) }>
                    <View style={{ height: "100%", flex: 1, flexDirection: "row", justifyContent:"center", alignItems: "center" }}>
                        <ImageBackground source={{ uri: item.image }} style={[ { width: size, height: size }, styles.background] }>
                            <View style={ styles.playButtonOverlay }>
                                <Icon name="ios-play" style={{ color: "rgba(255, 255, 255, 0.7)", marginLeft: 4 }}/>
                            </View>
                        </ImageBackground>
                        <View style={{ height: "100%", marginLeft: 10, paddingRight: 15, flex: 1, borderBottomWidth: 1, borderBottomColor: "#c1c1c180" }}>
                            <Text numberOfLines={ 1 } >{ item.name }</Text>
                            <Text numberOfLines={ 1 } note>{ item.album_name }</Text>
                            <Text numberOfLines={ 1 } note>{ item.artist_name }</Text>
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={ SCREEN_SONGS_COLOR + '10' } style={{ flex: -1 }} onPress={ () => this._onRightPressItem(`${item.id}`) }>
                    <View style={{ height: "100%", justifyContent:"center", alignItems:"center", borderBottomWidth: 1, borderBottomColor: "#c1c1c180" }}>
                        <Icon name="ios-paper-plane-outline" style={ styles.actionButtonText }/>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        justifyContent: "center",
        alignItems: "center"
    },
    playButtonOverlay: {
        width: 30,
        height: 30,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)"
    },
    actionButtonText: {
        //marginRight: 10,
        paddingHorizontal: 10,
        color: SCREEN_SONGS_COLOR
    }
})

/*
<Text style={ styles.actionButtonText }>{"wave\nme"}</Text>
        fontSize: 12,
        textAlign: "center",
*/