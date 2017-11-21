curl -X POST \
    -H "Authorization: key=AAAA6c2rEmI:APA91bHsNtefc_9ZpA2JIWLgbx2079lxKL7W10mOiAeZdFoYkHOzGIdLQamlADiL8ogA7jTq6H1EFAIN4RwkzLPXgrwVjtgld7ES_1vtAPGI6_uW2xGVOZaAypCfq5plhpvfgTPopug6" \
    -H "Content-Type: application/json" \
    -d '{
        "notification": {
            "body": "Firebase Cloud Message"
            "title": "From el puto amo",
        },
        "show_in_foreground": true,
        "local_notification": true
        "to" : "fHguOsvNxY4:APA91bG9d2XtwAie45OjKsZL6HMWkKjxJU4dtYoIFx0SwjXXlx0qXZuNciVig6LCWRQ62PerjBsVyD6L7tL_uQoSGj-g0lpCOHcKlFZZRkJgqGMSLCFsD8GSN4oJNoorpAJsiwqbZH0H"
    }' \
    'https://fcm.googleapis.com/fcm/send'