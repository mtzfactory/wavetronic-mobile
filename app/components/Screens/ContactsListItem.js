import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { ListItem } from 'react-native-elements'

import { SCREEN_CONTACTS_COLOR } from '../../constants'

const moment = require('moment')

export default class ContactsListItem extends React.PureComponent {
    _onPressItem = (friendId, friendName) => {
        this.props.onItemPressed(friendId, friendName)
    }

    render () {
        const { listItem } = this.props

        const RIGHT_ICON = listItem.confirmed ? 'check' : 'chevron-right'
        const RIGHT_ICON_COLOR = listItem.confirmed ? SCREEN_CONTACTS_COLOR : '#c9c9c9'

        return (
            <View style={ styles.list }>
                <ListItem 
                    title={ listItem.username }
                    subtitle={ listItem.confirmed ? null : "hmm... not confirmed yet" }
                    leftIcon={{ name: 'ios-person-outline', type: 'ionicon', style: { color: SCREEN_CONTACTS_COLOR } }}
                    rightIcon={{ name: RIGHT_ICON, type: 'material', style: { color: RIGHT_ICON_COLOR } }}
                    key={ listItem._id }
                    onPress={ () => !listItem.confirmed && this._onPressItem(listItem._id, listItem.username) }/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    list: { marginHorizontal: 10 },
})