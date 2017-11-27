import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { ListItem } from 'react-native-elements'

import { SCREEN_CONTACTS_COLOR } from '../../constants'
import SwipeOut from '../SwipeOut'

export default class ContactsListItem extends React.PureComponent {
    render () {
        const { listItem, onPressItem, onRemovePressed } = this.props

        const RIGHT_ICON = listItem.confirmed ? 'check' : 'chevron-right'
        const RIGHT_ICON_COLOR = listItem.confirmed ? SCREEN_CONTACTS_COLOR : '#c9c9c9'

        const SWIPEOUT_RIGHT = [
            {
              autoClose: true,
              icon: 'ios-trash-outline',
              props: {
                    onPress: () => onRemovePressed(listItem._id) ,
                    style: {
                        backgroundColor: SCREEN_CONTACTS_COLOR,
                        width: 70,
                    },
                    underlayColor: SCREEN_CONTACTS_COLOR + 'A0',
                }
            }
        ]

        return (
            // <SwipeOut
            //     right={ SWIPEOUT_RIGHT }>
                <View style={ styles.list }>
                    <ListItem 
                        title={ listItem.username }
                        subtitle={ listItem.confirmed ? null : "hmm... not confirmed yet" }
                        leftIcon={{ name: 'ios-person-outline', type: 'ionicon', style: { color: SCREEN_CONTACTS_COLOR } }}
                        rightIcon={{ name: RIGHT_ICON, type: 'material', style: { color: RIGHT_ICON_COLOR } }}
                        key={ listItem._id }
                        onPress={ () => !listItem.confirmed && onPressItem(listItem._id, listItem.username) }/>
                </View>
            // </SwipeOut>
        )
    }
}

const styles = StyleSheet.create({
    list: { marginHorizontal: 10 },
})