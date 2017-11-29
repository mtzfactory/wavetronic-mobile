import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { ListItem } from 'react-native-elements'

import { SCREEN_PLAYLISTS_COLOR } from '../../constants'

export default class PlaylistsListItem extends React.PureComponent {
    _onPressItem = (id, name) => {
        this.props.onItemPressed(id, name)
    }

    render () {
        const { item } = this.props

        return (
            <ListItem  containerStyle={[ styles.item, this.props.style ] }
                disabled={ item.amount === 0 }
                title={ item.name.toUpperCase() }
                subtitle={ item.description }
                leftIcon={{ name: 'ios-infinite', type: 'ionicon', style: { color: SCREEN_PLAYLISTS_COLOR } }}
                rightTitle={ `${item.amount} tracks` }
                rightIcon={{ name: 'ios-list-outline', type: 'ionicon', style: { color: SCREEN_PLAYLISTS_COLOR, marginLeft: 15 } }}
                key={ item._id }
                onPress={ () => this._onPressItem(item._id, item.name) }/>
        )
    }
}

const styles = StyleSheet.create({
    item: { marginHorizontal: 10, justifyContent: 'center' },
})