import React, { Component } from 'react'
import { StyleSheet, Alert } from 'react-native'
import { View, ListItem, Left, Right, Body, Thumbnail, Text, Button } from 'native-base'
import ActionButton from 'react-native-action-button'

import { API_URL_TRACKS } from '../Constants'
import InfiniteList from '../InfiniteList'
import FabNavigator from '../FabNavigator'

const SCREEN = 'Songs'

class PureListItem extends React.PureComponent {
    render() {
        const { listItem } = this.props

        return (
            <ListItem thumbnail button={true} onPress={ () => this.props.handlePlaySong(listItem) }>
                <Left>
                    <Thumbnail square large source={{ uri: listItem.image }} />
                </Left>
                <Body>
                    <Text numberOfLines={ 1 } >{ listItem.name }</Text>
                    <Text numberOfLines={ 1 } note>{ listItem.album_name }</Text>
                    <Text numberOfLines={ 1 } note>{ listItem.artist_name }</Text>
                </Body>
                <Right>
                    <Button transparent>
                        <Text>Play</Text>
                    </Button>
                </Right>
            </ListItem>
        )
    }
}

export default class SongsScreen extends Component {
    static navigationOptions = {
        title: SCREEN,
        headerLeft: null,
        headerTitleStyle : { alignSelf: 'center' }
    }

    constructor() {
        super()

        this.state = {
            songId: null,   // para marcar el listitem de otro color....
        }
    }

    _renderItem = (item) => (
        <PureListItem listItem={ item } handlePlaySong={ this.props.screenProps.handlePlaySong } />
    )

    render() {
        const ROWHEIGTH = 80 + 15 + 15 // 80 por Thumbnail large + 2 * (12+3) ListItem paddingVertical
        const { navigate, state: { params } } = this.props.navigation
        const { isPlayerVisible } = this.props.screenProps

        return (
            <View style={ styles.container }>
                <InfiniteList
                    url={ API_URL_TRACKS }
                    renderItem={ this._renderItem }
                    rowHeight={ ROWHEIGTH }
                    cols= { 2 }
                    searchHolder='Search for albums ...'
                    searchIcon='ios-disc'
                    token={params.token}
                />
                <FabNavigator current={ SCREEN } navigate={ navigate } token={params.token} isPlayerVisible={ isPlayerVisible } />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})