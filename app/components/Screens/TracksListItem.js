import React, { Component } from 'react'
import { StyleSheet, ImageBackground } from 'react-native'
import { View, ListItem, Left, Right, Body, Thumbnail, Text, Button, Icon } from 'native-base'

export default class TracksListItem extends React.PureComponent {
    render () {
        const { listItem, index, size } = this.props

        return (
            <ListItem thumbnail button={true} onPress={ () => this.props.playSong(index , listItem) }>
                <Left>
                    <ImageBackground source={{ uri: listItem.image }} style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
                        <View style={{ width: 30, height: 30, borderRadius: 50, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
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
                    <Button transparent onPress={ () => this.props.shareTrack(`${listItem.id}`) }>
                        <Text style={{ textAlign: "center" }}>{"wave\nme"}</Text>
                    </Button>
                </Right>
            </ListItem>
        )
    }
}