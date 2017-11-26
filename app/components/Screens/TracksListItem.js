import React, { Component } from 'react'
import { StyleSheet, ImageBackground } from 'react-native'
import { View, ListItem, Left, Right, Body, Thumbnail, Text, Button, Icon } from 'native-base'

import { SCREEN_SONGS_COLOR } from '../../constants'

export default class TracksListItem extends React.PureComponent {
    _onPressItem = (index , listItem) => {
        this.props.playSong(index , listItem)
    }

    _onRightPressItem = (listItemId) => {
        this.props.shareTrack(listItemId)
    }

    render () {
        const { listItem, index, size } = this.props

        return (
            <ListItem thumbnail button={true} onPress={ () => this._onPressItem(index , listItem) }>
                <Left>
                    <ImageBackground source={{ uri: listItem.image }} style={[ { width: size, height: size }, styles.background] }>
                        <View style={ styles.playButtonOverlay }>
                            <Icon name="ios-play" style={{ color: "rgba(255, 255, 255, 0.7)", marginLeft: 4 }}/>
                        </View>
                    </ImageBackground>
                </Left>
                <Body>
                    <Text numberOfLines={ 1 } >{ listItem.name }</Text>
                    <Text numberOfLines={ 1 } note>{ listItem.album_name }</Text>
                    <Text numberOfLines={ 1 } note>{ listItem.artist_name }</Text>
                </Body>
                <Right>
                    <Button transparent onPress={ () => this._onRightPressItem(`${listItem.id}`) }>
                        <Text style={ styles.actionButtonText }>{"wave\nme"}</Text>
                    </Button>
                </Right>
            </ListItem>
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
        textAlign: "center",
        color: SCREEN_SONGS_COLOR
    }
})