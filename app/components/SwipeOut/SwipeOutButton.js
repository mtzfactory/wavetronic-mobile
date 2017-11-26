import React, { Component } from 'react'
import { Animated, StyleSheet, Text, TouchableHighlight } from 'react-native'
import { Icon } from 'native-base'

export default class Btn extends Component {
  render() {
    let { panDimensions, style, text, icon, width } = this.props
    let customStyle = style || {}
    let setWidth = { width: Math.ceil(width) }

    const BUTTON = icon
      ? <Icon style={[ styles.btnText, setWidth ]} name={icon}/>
      : <Text style={[ styles.btnText, setWidth ]}>{text}</Text>

    return (
      <Animated.View style={[ panDimensions ]}>
        <TouchableHighlight { ...this.props } style={[ styles.btn, customStyle ]}>
          { BUTTON }
        </TouchableHighlight>
      </Animated.View>
    )
  }
}

var styles = StyleSheet.create({
  btn: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
})