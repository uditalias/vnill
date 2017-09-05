import { IStateView } from './State';
import * as pathToRegexp from 'path-to-regexp'
import { Controller, IControllerConstructor } from './Controller'
import scopeFactory from './scopeFactory'

export interface IStateView {
    name: string
    controller: IControllerConstructor
    template: string
    resolve: {
        [name: string]: (State) => any
    }
}

export interface IStateSettings {
    name: string
    url: string
    controller: IControllerConstructor
    template: string
    onEnter: Function
    onExit: Function
    views: {
        [name: string]: IStateView
    }
    resolve: {
        [name: string]: (State) => any
    }
}

export class State {
    public name: string;
    public url: string;
    public controller: IControllerConstructor;
    public template: string;
    public onEnter: Function;
    public onExit: Function;
    public views: { [name: string]: IStateView };
    public resolve: { [name: string]: (State) => any };
    public parentStateName: string;
    public parentState: State;

    private _domContext: HTMLElement;
    private _stateController: Controller;
    private _viewsControllers: Controller[];
    private _data: any;
    private _pathRegx: RegExp;
    private _pathKeys: pathToRegexp.Key[];
    private _isActive: boolean;

    constructor(settings: IStateSettings) {
        this.name = settings.name
        this.url = settings.url;
        this.controller = settings.controller;
        this.template = settings.template;
        this.onEnter = settings.onEnter;
        this.onExit = settings.onExit;
        this.views = settings.views;
        this.resolve = settings.resolve;
        this.parentStateName = null;
        this.parentState = null;

        this._isActive = false;

        this._pathKeys = [];
        this._pathRegx = pathToRegexp(this.url, this._pathKeys);

        this._domContext = null;

        this._stateController = null;
        this._viewsControllers = [];

        this._data = null;

        this._setParentStateName();
    }

    public isRouteFulfill(path: string) {
        return !!this._pathRegx.exec(path);
    }

    public resolvePathFromData(data: any): string {
        return pathToRegexp.compile(this.url)(data);
    }

    public resolveDataFromPath(path: string): any {
        let data = null, results;
        if ((results = this._pathRegx.exec(path)) && results.length > 1) {
            results = results.slice(1);

            data = {};
            for (let i = 0, len = this._pathKeys.length; i < len; i++) {
                data[this._pathKeys[i].name] = results[i].toString();
            }
        }

        return data;
    }

    public setData(data: any) {
        this._data = data;
    }

    public getData() {
        return this._data;
    }

    public isActive() {
        return this._isActive;
    }

    public getController(): Controller {
        return this._stateController;
    }

    public async activate(context?: State) {
        if (this.onEnter) {
            this.onEnter(this);
        }

        this._isActive = true;

        let domContext: Document | HTMLElement = document;

        if (context) {
            this._setParentState(context);

            domContext = context.getDOMContext();
        }

        let placeholder = domContext.querySelector('[data-view]');

        placeholder.innerHTML = this.template;

        this._domContext = <HTMLElement>placeholder.firstChild;

        this._stateController = await this._createController(this.controller, this.resolve);

        this._renderViews();
    }

    public getDOMContext(): HTMLElement {
        return this._domContext;
    }

    public deactivate() {
        if (this.onExit) {
            this.onExit(this);
        }

        this._setParentState(null);

        this._isActive = false;

        if (this._stateController) {
            this._stateController.destroy();
            this._stateController = null;
        }

        if (this._viewsControllers.length) {
            for (let i = 0, len = this._viewsControllers.length; i < len; i++) {
                this._viewsControllers[i].destroy();
                this._viewsControllers[i] = null;
            }

            this._viewsControllers.length = 0;
        }

        this._data = null;

        if (this._domContext) {
            this._domContext.parentElement.removeChild(this._domContext);
            this._domContext = null;
        }
    }

    private async _getResolvedData(resolvers: any): Promise<any> {
        if (!resolvers) {
            return;
        }

        let resolversValues = [];
        let keys = Object.keys(resolvers);
        let data: any = {};

        keys.forEach(name => {
            let resolver = resolvers[name];

            if (typeof resolver === 'function') {
                resolversValues.push(resolvers[name](this));
            } else {
                resolversValues.push(resolvers[name]);
            }
        });

        let resolved = await Promise.all(resolversValues);

        keys.forEach((key, i) => data[key] = resolved[i]);

        return data;
    }

    private async _createController(ControllerConstructor: IControllerConstructor, resolve: any = {}) {
        if (ControllerConstructor) {

            let resolvedData = await this._getResolvedData(resolve);

            let scope = scopeFactory.create(resolvedData);

            return new ControllerConstructor(scope, this._data, this._domContext);
        }
    }

    private _renderViews() {
        if (!this.views) {
            return;
        }

        return Promise.all(
            Object.keys(this.views).map(viewName => this._renderView(viewName))
        );
    }

    private async _renderView(viewName: string) {
        let view = <IStateView>this.views[viewName];

        viewName = view.name || viewName;

        let container = this._domContext.querySelector(`[data-view="${viewName}"]`);

        if (container) {
            let placeholder = document.createElement('div');
            placeholder.innerHTML = view.template;

            container.parentElement.replaceChild(placeholder.firstChild, container);
            placeholder = null;

            let ViewController = view.controller;

            if (ViewController) {
                this._viewsControllers.push(await this._createController(ViewController, view.resolve));
            }
        }
    }

    private _setParentStateName() {
        let stateParts = this.name.split('.');

        if (stateParts.length > 1) {
            this.parentStateName = stateParts[0];
        }
    }

    private _setParentState(state: State) {
        this.parentState = state;
    }
}