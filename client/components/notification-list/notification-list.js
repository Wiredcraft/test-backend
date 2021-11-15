class NotificationList extends Component {
    build () {
        $on('*', $when('notification', ({ notification, url, important, ...others }) => {
            // console.log('Notification!!!', notification, url, important)
            const h2 = this.$('main').prependHTML(html`<h2>${notification}</h2>`)
            if (url) {
                h2.on('click', $open.with(url))
            }
            h2.on('animationend', () => {
//                 console.log('Bye~~')
                h2.remove()
            })

            if (important) {
                Notification.requestPermission(status => window.notificationPermission = status === 'granted')
                const n = new Notification(important, others)  // something: 'One Two...', body: 'SHOW in the notification bottom', icon,
                n.onclick = $open.with(url)
            }
        }))
    }
}

window.customElements.define('notification-list', NotificationList)
window.assign({ NotificationList })
export default NotificationList





// window.nextFrame(() => this.app.newNotification(data))