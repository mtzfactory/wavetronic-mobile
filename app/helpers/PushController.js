import React, { Component } from "react"
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
            //console.log("getInitialNotification", notif)
        })

        // This method give received notifications to mobile to display.
        this.notificationListener = FCM.on(FCMEvent.Notification, async notif => {
            console.log('onNotification', notif);
            if (notif && notif.local_notification) {
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

        FCM.subscribeToTopic('mtzFactory')

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
            body: notif.fcm.body,
            priority: "high",
            title: notif.fcm.title,
            sound: "default",
            show_in_foreground: true,
            tag: "mtzFactory"
        })
    }

    componentWillUnmount() {
        this.notificationListener.remove()
        this.refreshTokenListener.remove()
    }

    render() {
        return null;
    }
}