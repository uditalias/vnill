import { Controller } from '../../../../build'

export default class ProfileController extends Controller {
    constructor() {
        super();

        this._onHomeClick = this._onHomeClick.bind(this);
        this._container = document.querySelector('.profile-container');
        this._homeBtn = document.querySelector('#homeBtn');

        this._container.classList.add('profile-page');

        this._homeBtn.addEventListener('click', this._onHomeClick, true);
    }

    _onHomeClick() {
        router.go('home');
    }

    destroy() {
        this._container = null;

        this._homeBtn.removeEventListener('click', this._onHomeClick, true);
        this._homeBtn = null;
    }
}