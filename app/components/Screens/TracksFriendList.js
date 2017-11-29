import React, { Component } from 'react'
import { Alert, View } from 'react-native'
import { ListItem } from 'react-native-elements'

import { API_PAGE_LIMIT, SCREEN_SONGS_COLOR } from '../../constants'

import InfiniteList from '../InfiniteList'

import UserApi from '../../api/UserApi'
const userApi = new UserApi()

const FRIENDS_ROW_HEIGTH = 50

export default class TracksFriendList extends Component {
    _sendTrackToFriend = (friendId, friendName) => {
        userApi.sendTrackToFriend(friendId, this.props.trackId)
            .catch(error => Alert.alert(error.message))
    }

    _renderFriendItem = (item, index) => (
        <View style={{ marginHorizontal: 10 }}>
        <ListItem disabled={ !item.confirmed }
            title={ item.username }
            subtitle={ item.confirmed ? null : "hmm... not confirmed yet" }
            leftIcon={{ name: 'ios-person-outline', type: 'ionicon', style: { color: SCREEN_SONGS_COLOR } }}
            rightTitle="Send"
            key={ item._id }
            onPress={ () => this._sendTrackToFriend(item._id, item.username) }/>
        </View>
    )

    render () {
        return (
            <InfiniteList
                getData={ userApi.getConfirmedFriends }
                limit={ API_PAGE_LIMIT }
                renderItem={ this._renderFriendItem }
                rowHeight={ FRIENDS_ROW_HEIGTH }
                searchHolder='Search for friends ...'
            />
        )
    }
}