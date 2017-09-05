import ProfileController from './ProfileController'
import UserInfoController from './UserInfoController'

export default {
    name: 'profile',
    url: '/profile',
    controller: ProfileController,
    // template: function (state, domContext) {
    //     domContext.innerHTML = require('./profile.html');
    // },
    template: require('./profile.html'),
    views: {
        user_info: {
            controller: UserInfoController,
            template: `<div>Im a user info component :)</div>`
        }
    }
}