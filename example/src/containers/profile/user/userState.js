import ProfileUserController from './ProfileUserController'

export default {
    name: 'profile.user',
    url: '/profile/@:userId',
    controller: ProfileUserController,
    template: `<div>I'm the Custom view :)</div>`,
    resolve: {
        user: (state) => {
            return new Promise(resolve => resolve({ id: state.getData().userId, name: 'Udi Talias' }));
        },
        userId: '123'
    }
}