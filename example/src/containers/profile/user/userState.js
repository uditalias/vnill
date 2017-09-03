import ProfileUserController from './ProfileUserController'

export default {
    name: 'profile.user',
    url: '/profile/:userId',
    controller: ProfileUserController,
    template: `<div>I'm the Custom view :)</div>`
}