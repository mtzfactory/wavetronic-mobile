import React, { Component } from 'react'
import { StyleSheet, View, TouchableHighlight, ImageBackground } from 'react-native'
import { ListItem, Body, Left, Right, Thumbnail, Text, Button } from 'native-base'

import { SCREEN_ALBUMS_COLOR } from '../../constants'

export default class PureListItem extends React.PureComponent {
    _openAlbum = (id, name) => {
        this.props.onItemPressed(id, name)
    }

    render () {
        const { listItem } = this.props

        return (
            <ListItem thumbnail button={true} onPress={ () => this._openAlbum(listItem.id, listItem.name) }>
                <Left>
                    <Thumbnail square large source={{ uri: listItem.image }} />
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