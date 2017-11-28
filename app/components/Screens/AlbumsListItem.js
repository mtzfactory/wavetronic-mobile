import React, { Component } from 'react'
import { StyleSheet, View, ImageBackground, TouchableWithoutFeedback } from 'react-native'
import { Text, Icon } from 'native-base'

import { SCREEN_ALBUMS_COLOR } from '../../constants'

export default class PureListItem extends React.PureComponent {
    _onPressItem = (id, name) => {
        this.props.onItemPressed(id, name)
    }

    render () {
        const { listItem, size, style } = this.props

        return (
            <View style={{ height: style.height, marginVertical: 5, marginHorizontal: 10, flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                <TouchableWithoutFeedback onPress={ () => this._onPressItem(listItem.id, listItem.name) }>
                    <View style={{ height: "100%", flex: 1, flexDirection: 'row', justifyContent:"center", alignItems: 'center' }}>
                        <ImageBackground source={{ uri: listItem.image }} style={[ { width: size, height: size }, styles.background] }>
                            <View style={ styles.playButtonOverlay }>
                                <Icon name="ios-play" style={{ color: "rgba(255, 255, 255, 0.7)", marginLeft: 4 }}/>
                            </View>
                        </ImageBackground>
                        <View style={{ height: "100%", marginLeft: 10, paddingRight: 15, flex: 1, borderBottomWidth: 1, borderBottomColor: "#c1c1c180" }}>
                            <Text numberOfLines={ 1 } >{ listItem.name }</Text>
                            <Text numberOfLines={ 1 } note>{ listItem.artist_name }</Text>
                            <Text numberOfLines={ 1 } note>{ listItem.releasedate }</Text>
                        </View>
                        <View style={{ height: "100%", justifyContent:"center", alignItems:"center", borderBottomWidth: 1, borderBottomColor: "#c1c1c180" }}>
                            <Icon name="ios-list-outline" style={ styles.actionButtonText }/>
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
        marginRight: 10,
        color: SCREEN_ALBUMS_COLOR,
    }
})

/*
<Text style={ styles.actionButtonText }>Open</Text>
        
        marginRight: 10,
        fontSize: 12,
        textAlign: "center",
        textAlignVertical: "center",
*/