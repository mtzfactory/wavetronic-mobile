import React, { Component } from 'react'
import { StyleSheet, View, TouchableHighlight, ImageBackground } from 'react-native'
import { ListItem, Body, Left, Right, Thumbnail, Text, Button } from 'native-base'

import { SCREEN_ALBUMS_COLOR } from '../../constants'

export default class PureListItem extends React.PureComponent {
    _onPressItem = (id, name) => {
        this.props.onItemPressed(id, name)
    }

    render () {
        const { listItem, index, size } = this.props

        return (
            <ListItem thumbnail button={true} onPress={ () => this._onPressItem(listItem.id, listItem.name) }>
                <Left>
                    <ImageBackground source={{ uri: listItem.image }} style={{ width: size, height: size }}>
                    </ImageBackground>
                </Left>
                <Body>
                    <Text numberOfLines={ 1 } >{ listItem.name }</Text>
                    <Text numberOfLines={ 1 } note>{ listItem.artist_name }</Text>
                    <Text numberOfLines={ 1 } note>{ listItem.releasedate }</Text>
                </Body>
                <Right>
                    <Button transparent>
                        <Text style={{ color: SCREEN_ALBUMS_COLOR }}>Open</Text>
                    </Button>
                </Right>
            </ListItem>
        )
    }
}