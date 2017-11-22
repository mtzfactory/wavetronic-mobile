import React, { Component } from 'react'
import { Alert } from 'react-native'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from "react-native-fcm"

export default class PushController extends Component {
    componentDidMount () {

        // this method generate fcm token.
        FCM.requestPermissions()
        FCM.getFCMToken().then(pnToken => {
            //console.log("PushController getFCMToken", pnToken)
            this.props.onChangeToken(pnToken)
        })

        // This method get all notification from server side.
        FCM.getInitialNotification().then(notif => {
            if (notif) {
                console.log("getInitialNotification", notif)
                Alert.alert('getInitialNotification', notif.title)
            }
        })

        // This method give received notifications to mobile to display.
        this.notificationListener = FCM.on(FCMEvent.Notification, async notif => {
            console.log('onNotification', notif);
            if (notif && notif.local_notification) {
                Alert.alert('local_notification', notif.title)
                return
            }
            if (notif && notif.opened_from_tray) {
                Alert.alert('opened_from_tray', notif.title)
                return
            }
            // Process the notification
            this.showLocalNotification(notif)
        })

        // this method call when FCM token is update(FCM token update any time so will get updated token from this method)
        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, pnToken => {
            //console.log('onRefreshToken', pnToken)
            this.props.onChangeToken(pnToken)
        })

        FCM.subscribeToTopic('mtzFactory_WaveMyBeat')

        // direct channel related methods are ios only
        // directly channel is truned off in iOS by default, this method enables it
        FCM.enableDirectChannel()

        this.channelConnectionListener = FCM.on(FCMEvent.DirectChannelConnectionChanged, (data) => {
            console.log('direct channel connected' + data)
        })

        setTimeout(function() {
            FCM.isDirectChannelEstablished().then(d => d)//console.log('isDirectChannelEstablished', d))
        }, 1000)
    }

    // This method display the notification on mobile screen.
    showLocalNotification(notif) {
        //console.log('showLocalNotification', notif)
        FCM.presentLocalNotification({
            title: notif.fcm.title,
            body: notif.fcm.body,
            click_action: notif.click_action,
            priority: 'high',
            sound: 'default',
            show_in_foreground: true,
            local: true
        })
    }

    componentWillUnmount() {
        FCM.unsubscribeFromTopic('mtzFactory_WaveMyBeat')
        this.notificationListener.remove()
        this.refreshTokenListener.remove()
    }

    render() {
        return null;
    }
}