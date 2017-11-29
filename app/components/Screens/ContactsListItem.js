import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { ListItem } from 'react-native-elements'

import { SCREEN_CONTACTS_COLOR } from '../../constants'

export default class ContactsListItem extends React.PureComponent {
    render () {
        const { item, onPressItem } = this.props

        let SUBTITLE = null
        let RIGHT_ICON = 'ios-checkmark'
        let RIGHT_ICON_COLOR = SCREEN_CONTACTS_COLOR
        switch(item.confirmed) {
            case undefined: 
                SUBTITLE = 'add friend'
                RIGHT_ICON = 'ios-arrow-forward'
                break;
            case false:
                SUBTITLE = 'hmm... not confirmed yet'
                RIGHT_ICON = 'ios-alarm-outline'
                RIGHT_ICON_COLOR = SCREEN_CONTACTS_COLOR + 'B0'
                break;
        }

        return (
            <ListItem containerStyle={[ styles.item, this.props.style ] }
                underlayColor={ SCREEN_CONTACTS_COLOR + '40' }
                title={ item.username }
                subtitle={ SUBTITLE }
                leftIcon={{ name: 'ios-person-outline', type: 'ionicon', style: { color: SCREEN_CONTACTS_COLOR } }}
                rightIcon={{ name: RIGHT_ICON, type: 'ionicon', style: { color: RIGHT_ICON_COLOR } }}
                key={ item._id }
                onPress={ () => item.confirmed === false && onPressItem(item._id, item.username) }/>
        )
    }
}

const styles = StyleSheet.create({
    item: { marginHorizontal: 10, justifyContent: 'center' }, 
})