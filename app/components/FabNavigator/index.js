import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Icon } from 'native-base'
import ActionButton from 'react-native-action-button'
import uuidv4 from 'uuid/v4'

import {
    FABNAVIGATOR_COLOR,
    SCREEN_SONGS_COLOR,
    SCREEN_ALBUMS_COLOR,
    SCREEN_PLAYLISTS_COLOR,
    SCREEN_CONTACTS_COLOR
} from '../../constants'

const buttonItems = [
    { title: 'Tracks', color: SCREEN_SONGS_COLOR, icon: 'headset', screen: 'Tracks' },
    { title: 'Albums', color: SCREEN_ALBUMS_COLOR, icon: 'disc', screen: 'Albums' },
    { title: 'Playlists', color: SCREEN_PLAYLISTS_COLOR, icon: 'infinite', screen: 'Playlists' },
    { title: 'Contacts', color: SCREEN_CONTACTS_COLOR, icon: 'contacts', screen: 'Contacts' }
]

export default class FabNavigator extends Component {
    constructor() {
        super()
        this.FAB_COLOR = FABNAVIGATOR_COLOR
    }
    componentWillMount() {
        this.FAB_COLOR = this.props.current !== undefined
        ? buttonItems.find(x => x.title === this.props.current).color
        : FABNAVIGATOR_COLOR
    }

    render() {
        const { current, navigate } = this.props

        return (
            <ActionButton fixNativeFeedbackRadius icon={<Icon style={{ color: "white" }} name="md-more"/>} buttonColor={ this.FAB_COLOR }>
                {
                    buttonItems.map((button, idx) => {
                        if (current === button.title) return {}

                        return (
                            <ActionButton.Item
                                fixNativeFeedbackRadius
                                key={ uuidv4() }
                                buttonColor={ button.color }
                                title={button.title}
                                onPress={ () => navigate(button.screen) }>
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
