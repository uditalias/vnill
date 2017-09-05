import { Controller } from '../../../../build'

export default class HomeController extends Controller {
    constructor(scope, stateData, domContext) {
        super(scope, stateData, domContext);

        this._onProfileClick = this._onProfileClick.bind(this);
        this._onNameInputChange = this._onNameInputChange.bind(this);
        this._profileBtn = domContext.querySelector('#profileBtn');
        this._profileMeBtn = domContext.querySelector('#profileMeBtn');
        this._profileCustomBtn = domContext.querySelector('#profileCustomBtn');
        this._container = domContext.querySelector('.home-container');
        this._name = domContext.querySelector('.name');
        this._nameInput = domContext.querySelector('#name');

        this._profileBtn.addEventListener('click', this._onProfileClick, true);
        this._profileMeBtn.addEventListener('click', this._onProfileMeClick, true);
        this._profileCustomBtn.addEventListener('click', this._onProfileCustomClick, true);
        this._nameInput.addEventListener('keyup', this._onNameInputChange, true);

        scope.watch("name", this._updateNameView, this);
    }

    _updateNameView(value, oldValue) {
        this._name.textContent = value;
    }

    _onNameInputChange(e) {
        this.scope.name = e.target.value;
    }

    _onProfileClick() {
        router.go('profile');
    }

    _onProfileMeClick() {
        router.go('profile.me');
    }

    _onProfileYouClick() {
        router.go('profile.you');
    }

    _onProfileCustomClick() {
        router.go('profile.user', { userId: 123456 });
    }

    destroy() {
        this._profileBtn.removeEventListener('click', this._onProfileClick, true);
        this._profileMeBtn.removeEventListener('click', this._onProfileMeClick, true);
        this._profileCustomBtn.removeEventListener('click', this._onProfileCustomClick, true);

        this._profileBtn = null;
        this._profileMeBtn = null;
        this._profileCustomBtn = null;
        this._container = null;
    }
}