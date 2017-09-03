import { State } from './State'
import { trimEndSlash } from '../common/utils'

export class Router {
    private _origPushState: Function;
    private _states: State[];
    private _currentParentState: State;
    private _currentState: State;

    constructor(states = {}) {
        this._origPushState = window.history.pushState;
        this._states = [];
        this._currentParentState = null;
        this._currentState = null;
        this._onPopState = this._onPopState.bind(this);

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
    }

    private _onPopState(e: PopStateEvent) {
        this._onPushState(e.state, null, window.location.pathname);
    }

    private _init(states: any) {
        Object.keys(states).forEach(stateName => {

            let state = states[stateName];

            // in a case we're using states as object (the names are the key)
            if (!state.name) {
                state.name = stateName;
            }

            this.addState(state);
        });
    }

    private _onPushState(data: any, title: string, url: string) {
        let state = this._findState(url);

        if (!state) {
            return;
        }

        state.setData(data);

        this._manageState(state);
    }

    private _findState(urlOrName: string): State {

        urlOrName = trimEndSlash(urlOrName)

        // first, we want to find if there is an exact, non-parameters state url or state with the same name
        let exactState = this._states.find(x => trimEndSlash(x.url) === urlOrName || x.name === urlOrName);

        if (exactState) {
            return exactState;
        }

        return this._states.find(x => x.isRouteFulfill(urlOrName));
    }

    private _manageState(state: State) {

        if (this._currentState) {
            if (state.parent !== this._currentState.name) {
                this._currentState.deactivate();
            } else {
                this._currentParentState = this._currentState;
            }
        }

        if (state.parent && !this._currentParentState) {
            let parentState = this._findState(state.parent);

            if (parentState) {
                parentState.activate();

                this._currentParentState = parentState;
            }
        } else if (this._currentParentState && this._currentParentState.name !== state.parent) {
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
        let state = this._findState(urlOrName);

        if (!state) {
            return;
        }

        let url = state.resolvePathFromData(data);

        window.history.pushState(data, null, url);
    }

    public start() {
        let url = window.location.pathname;

        let state = this._findState(url);

        if (!state) {
            return;
        }

        let data = state.resolveDataFromPath(url);

        state.setData(data);

        this._manageState(state);
    }

    public addState(state: any | any[]) {
        if (state instanceof Array) {
            state.forEach(x => this.addState(x));
        } else {
            this._states.push(new State(state));
        }
    }

}