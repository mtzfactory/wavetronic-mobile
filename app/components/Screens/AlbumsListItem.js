import React, { Component } from 'react'
import { StyleSheet, View, ImageBackground, TouchableWithoutFeedback } from 'react-native'
import { Text, Icon } from 'native-base'

import { SCREEN_ALBUMS_COLOR } from '../../constants'

export default class PureListItem extends React.PureComponent {
    _onPressItem = (id, name) => {
        this.props.onItemPressed(id, name)
    }

    render () {
        const { listItem, size } = this.props

        return (
            <View style={{ height: size, marginVertical: 5, marginHorizontal: 10, flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                <TouchableWithoutFeedback onPress={ () => this._onPressItem(listItem.id, listItem.name) }>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <ImageBackground source={{ uri: listItem.image }} style={[ { width: size, height: size }, styles.background] }>
                            <View style={ styles.playButtonOverlay }>
                                <Icon name="ios-play" style={{ color: "rgba(255, 255, 255, 0.7)", marginLeft: 4 }}/>
                            </View>
                        </ImageBackground>
                        <View style={{ marginLeft: 10, paddingRight: 15, flex: 1, borderBottomWidth: 1, borderBottomColor: "#c1c1c180" }}>
                            <Text numberOfLines={ 1 } >{ listItem.name }</Text>
                            <Text numberOfLines={ 1 } note>{ listItem.artist_name }</Text>
                            <Text numberOfLines={ 1 } note>{ listItem.releasedate }</Text>
                        </View>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: "#c1c1c180" }}>
                            <Text style={ styles.actionButtonText }>Open</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        justifyContent: "center",
        alignItems: "center"
    },
    playButtonOverlay: {
        width: 30,
        height: 30,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)"
    },
    actionButtonText: {
        height: '100%',
        marginRight: 10,
        fontSize: 12,
        textAlign: "center",
        textAlignVertical: "center",
        color: SCREEN_ALBUMS_COLOR,
    }
})