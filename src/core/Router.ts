import { State, IStateSettings } from './State'
import { trimEndSlash } from '../common/utils'

export class Router {
    private _origPushState: Function;
    private _states: State[];
    private _currentParentState: State;
    private _currentState: State;

    constructor(states: { [name: string]: IStateSettings } | IStateSettings[] = {}) {
        this._origPushState = window.history.pushState;
        this._states = [];
        this._currentParentState = null;
        this._currentState = null;
        this._onPopState = this._onPopState.bind(this);
        this._onDocumentClick = this._onDocumentClick.bind(this);

        this._setup();

        this._init(states);
    }

    private _setup() {
        let self = this;

        window.history.pushState = function () {
            self._origPushState.apply(window.history, arguments);
            self._onPushState.apply(self, arguments);
        }

        window.addEventListener('popstate', this._onPopState, true);
        document.addEventListener('click', this._onDocumentClick, true);
    }

    private _onPopState(e: PopStateEvent) {
        this._onPushState(e.state, null, window.location.pathname);
    }

    private _onDocumentClick(e: MouseEvent) {
        if (e.target instanceof HTMLAnchorElement) {
            let dataset = e.target.dataset,
                to = dataset.to,
                params;

            if (!to) {
                return true;
            }

            if (dataset.params) {
                params = JSON.parse(dataset.params);
            }

            this.go(to, params);

            e.preventDefault();
        }
    }

    private _init(states: { [name: string]: IStateSettings } | IStateSettings[]) {
        Object.keys(states).forEach(stateName => {

            let state = <IStateSettings>states[stateName];

            // in a case we're using states as object (the names are the keys)
            if (!state.name) {
                state.name = stateName;
            }

            this.addState(state);
        });
    }

    private _onPushState(data: any, title: string, url: string) {
        let state;
        if (!(state = this._findState(url))) {
            return;
        }

        state.setData(data);

        this._manageState(state);
    }

    private _findState(urlOrName: string): State {

        urlOrName = trimEndSlash(urlOrName);

        // first, we want to find if there is an exact, non-parameters state url or state with the same name
        let exactState = this._states.find(x => trimEndSlash(x.url) === urlOrName || x.name === urlOrName);

        if (exactState) {
            return exactState;
        }

        return this._states.find(x => x.isRouteFulfill(urlOrName));
    }

    private async _manageState(state: State) {

        if (this._currentState) {
            if (state.parentStateName !== this._currentState.name) {
                this._currentState.deactivate();
            } else {
                this._currentParentState = this._currentState;
            }
        }

        if (state.parentStateName && !this._currentParentState) {
            let parentState = this._findState(state.parentStateName);

            if (parentState) {
                await parentState.activate();

                this._currentParentState = parentState;
            }
        } else if (this._currentParentState && this._currentParentState.name !== state.parentStateName) {
            this._currentParentState.deactivate();
            this._currentParentState = null;
        }

        this._currentState = state;

        state.activate(this._currentParentState);
    }

    public get currentState(): State {
        return this._currentState;
    }

    public go(urlOrName: string, data: any) {
        let state;
        if (!(state = this._findState(urlOrName))) {
            return;
        }

        if (this._currentState && this._currentState.name == state.name) {
            return;
        }

        let url = state.resolvePathFromData(data);

        window.history.pushState(data, null, url);
    }

    public start() {
        let url = window.location.pathname;

        let state;
        if (!(state = this._findState(url))) {
            return;
        }

        let data = state.resolveDataFromPath(url);

        state.setData(data);

        this._manageState(state);
    }

    public addState(state: IStateSettings | IStateSettings[]) {
        if (state instanceof Array) {
            state.forEach(x => this.addState(x));
        } else {
            this._states.push(new State(state));
        }
    }

}