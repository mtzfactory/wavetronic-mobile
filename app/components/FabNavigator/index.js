import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Icon } from 'native-base'
import ActionButton from 'react-native-action-button'
import uuidv4 from 'uuid/v4'

import {
    PRIMARY_COLOR,
    SCREEN_SONGS_COLOR,
    SCREEN_ALBUMS_COLOR,
    SCREEN_PLAYLISTS_COLOR,
    SCREEN_CONTACTS_COLOR
} from '../../constants'
// rgba(231,76,60,1)

const buttonItems = [
    { title: 'Songs', color: SCREEN_SONGS_COLOR, icon: 'headset', screen: 'Songs' },
    { title: 'Albums', color: SCREEN_ALBUMS_COLOR, icon: 'disc', screen: 'Albums' },
    { title: 'Playlists', color: SCREEN_PLAYLISTS_COLOR, icon: 'infinite', screen: 'Playlists' },
    { title: 'Contacts', color: SCREEN_CONTACTS_COLOR, icon: 'contacts', screen: 'Contacts' }
]

export default class FabNavigator extends Component {
    render() {
        const { current, navigate, token, isPlayerVisible } = this.props

        return (
            <ActionButton fixNativeFeedbackRadius buttonColor={ PRIMARY_COLOR } offsetY={ isPlayerVisible ? 30 : 30 }>
                {
                    buttonItems.map((button, idx) => {
                        if (current === button.title) return {}

                        return (
                            <ActionButton.Item
                                fixNativeFeedbackRadius
                                key={ uuidv4() }
                                buttonColor={ button.color }
                                title={button.title}
                                onPress={ () => navigate(button.screen, { token }) }>
                                <Icon name={ button.icon } style={ styles.actionButtonIcon } />
                            </ActionButton.Item>
                        )
                    })
                }
            </ActionButton>
        )
    }
}

FabNavigator.propTypes = {
    navigate: PropTypes.func,
    current: PropTypes.string,
    isPlaying: PropTypes.bool
}

const styles = StyleSheet.create({
    actionButtonIcon: {
      fontSize: 20,
      height: 22,
      color: 'white',
    },
})