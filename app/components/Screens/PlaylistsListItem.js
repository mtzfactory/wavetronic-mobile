import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { ListItem } from 'react-native-elements'

import { SCREEN_PLAYLISTS_COLOR } from '../../constants'

const moment = require('moment')

export default class PlaylistsListItem extends React.PureComponent {
    _onPressItem = (id, name) => {
        this.props.onItemPressed(id, name)
    }

    render () {
        const { listItem, columns } = this.props

        return (
            <View style={ styles.list }>
            <ListItem 
                disabled={ listItem.amount === 0 }
                title={ listItem.name.toUpperCase() }
                subtitle={ listItem.description }
                leftIcon={{ name: 'ios-infinite', type: 'ionicon', style: { color: SCREEN_PLAYLISTS_COLOR } }}
                rightTitle={ `${listItem.amount} tracks` }
                rightIcon={{ name: 'ios-list-outline', type: 'ionicon', style: { color: SCREEN_PLAYLISTS_COLOR, marginLeft: 15 } }}
                key={ listItem._id }
                onPress={ () => this._onPressItem(listItem._id, listItem.name) }/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    list: {
        marginHorizontal: 10,
    },
})