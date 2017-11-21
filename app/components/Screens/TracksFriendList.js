import React, { Component } from 'react'
import { Alert } from 'react-native'
import { ListItem } from 'react-native-elements'

import { SCREEN_SONGS_COLOR } from '../../constants'

import InfiniteList from '../InfiniteList'

import UserApi from '../../api/UserApi'
const userApi = new UserApi()

const THUMBNAIL_SIZE = 70
const ROW_HEIGTH = THUMBNAIL_SIZE + 17 + 17 // 80 por Thumbnail large + 2 * (12+3) ListItem paddingVertical

export default class TracksFriendList extends Component {
    _sendTrackToFriend (friendId) {
        userApi.sendTrackToFriend(friendId, this.props.trackId)
            .catch(error => Alert.alert(error.message))
    }

    _renderFriendItem = (item, index) => (
        <ListItem disabled={ !item.confirmed }
            title={ item.username }
            subtitle={ item.confirmed ? null : "friendship not confirmed" }
            leftIcon={{ name: 'ios-person-outline', type: 'ionicon', style: { color: SCREEN_SONGS_COLOR } }}
            rightTitle="Send"
            key={ item._id }
            onPress={ () => this._sendTrackToFriend(item.username) }/>
    )

    render () {
        return (
            <InfiniteList
                getData={ userApi.getRealFriends }
                renderItem={ this._renderFriendItem }
                rowHeight={ ROW_HEIGTH }
                searchHolder='Search for friends ...'
            />
        )
    }
}