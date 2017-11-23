import React, { Component } from 'react'
import { Alert } from 'react-native'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from "react-native-fcm"
import _ from 'lodash'

export default class PushService extends Component {
    constructor() {
        super()
        this.state = { notif: [] }
    }

    showLocalNotification (notif) {
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

    removeProcessedNotification (id) {
        FCM.removeDeliveredNotification(id)
        const remainigNotif = this.state.notif.filter(item => {
            return item.id !== id;
        })
        console.log(remainigNotif)
        this.setState({ notif: remainigNotif })
    }

    componentDidMount () {
        FCM.requestPermissions()
        FCM.getFCMToken().then(pnToken => {
            this.props.onChangeToken(pnToken)
        })

        FCM.getInitialNotification().then(notif => {
            if (notif) {
                if (notif.title) Alert.alert(notif.title)
            }
        })

        this.notificationListener = FCM.on(FCMEvent.Notification, async notif => {
            // Process the notification
            let track = {}, friend = null, id = null
            if (notif.track) {
                this.setState(prevState => { return { notif: [ ...prevState.notif, notif ] } })
                track = JSON.parse(notif.track)
                friend = notif.friend
                id = notif.id
            }
            else if (this.state.notif.length > 0) {
                const previousNotif = _.find(this.state.notif, { id: notif.id })
                if (previousNotif) {
                    track = JSON.parse(previousNotif.track)
                    friend = previousNotif.friend
                    id = previousNotif.id
                }
            }

            if (Object.keys(track).length > 0) this.props.onNotificationReceived(friend, track, id)
        })

        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, pnToken => {
            this.props.onChangeToken(pnToken)
        })

        FCM.subscribeToTopic('mtzFactory_WaveMyBeat')
    }

    componentWillUnmount () {
        FCM.unsubscribeFromTopic('mtzFactory_WaveMyBeat')
        FCM.removeAllDeliveredNotifications()
        this.notificationListener.remove()
        this.refreshTokenListener.remove()
    }

    render () {
        return null
    }
}