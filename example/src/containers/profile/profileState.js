import ProfileController from './ProfileController'
import UserInfoController from './UserInfoController'

export default {
    name: 'profile',
    url: '/profile',
    controller: ProfileController,
    template: require('./profile.html'),
    views: {
        user_info: {
            controller: UserInfoController,
            template: `<div>Im a user info component :)</div>`
        }
    }
}