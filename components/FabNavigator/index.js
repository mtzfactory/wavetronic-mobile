import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Icon } from 'native-base'
import ActionButton from 'react-native-action-button'
import uuidv4 from 'uuid/v4'

import { PRIMARY_COLOR } from '../Constants'
// rgba(231,76,60,1)

const buttonItems = [
    { title: 'Songs', color: '#9b59b6', icon:'headset', screen: 'Songs' },
    { title: 'Albums', color: '#3498db', icon:'disc', screen: 'Albums' },
    { title: 'Playlists', color: '#1abc9c', icon:'infinite', screen: 'Playlists' },
    { title: 'Contacts', color: '#F1C40F', icon:'contacts', screen: 'Contacts' }
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