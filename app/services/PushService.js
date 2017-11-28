import React, { Component } from 'react'
import { Alert } from 'react-native'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from "react-native-fcm"
import _ from 'lodash'

export default class PushService extends Component {
    constructor() {
        super()
        this.state = { notif: [] }
    }

    removeProcessedNotification (id) {
        FCM.removeDeliveredNotification(id)
        const remainigNotif = this.state.notif.filter(item => {
            return item.id !== id;
        })
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
            if (!notif.opened_from_tray && (notif.type === 'track' || notif.type === 'friendship-request')) {
                this.setState(prevState => { return { notif: [ ...prevState.notif, notif ] } })
            }
            else if (this.state.notif.length > 0) { // find the notif that comes from pressing the sys tray...
                const previousNotif = _.find(this.state.notif, { id: notif.id })
                if (previousNotif) {
                    if (previousNotif.type === 'track') {
                        notif.track = previousNotif.track
                    }
                    if (previousNotif.type === 'friendship-request') {
                        notif.userId = previousNotif.userId
                    }
                    notif.type = previousNotif.type
                    notif.fromUser = previousNotif.fromUser
                    notif.id = previousNotif.id
                }
            }

            if (notif.type === 'track') this.props.onReceivedTrack(notif)
            if (notif.type === 'friendship-request') this.props.onReceivedFriendRequest(notif)
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