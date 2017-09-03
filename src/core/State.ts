import * as pathToRegexp from 'path-to-regexp'
import { Controller } from './Controller'
import scopeFactory from './scopeFactory'

export class State {
    public name: string;
    public url: string;
    public controller: any;
    public template: string;
    public onEnter: Function;
    public onExit: Function;
    public views: any;
    public parent: any;

    private _domContext: HTMLElement;
    private _stateController: Controller;
    private _viewsControllers: Controller[];
    private _data: any;
    private _pathRegx: RegExp;
    private _pathKeys: pathToRegexp.Key[];
    private _isActive: boolean;

    constructor(settings) {
        this.name = settings.name
        this.url = settings.url;
        this.controller = settings.controller;
        this.template = settings.template;
        this.onEnter = settings.onEnter;
        this.onExit = settings.onExit;
        this.views = settings.views;
        this.parent = null;

        this._isActive = false;

        this._pathKeys = [];
        this._pathRegx = pathToRegexp(this.url, this._pathKeys);

        this._domContext = null;

        this._stateController = null;
        this._viewsControllers = [];

        this._data = null;

        this._setParent();
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

    public activate(context?: State) {
        if (this.onEnter) {
            this.onEnter(this);
        }

        this._isActive = true;

        let domContext;

        if (context) {
            domContext = context.getDOMContext();
        } else {
            domContext = document;
        }

        let parent = domContext.querySelector('[data-view]');

        parent.innerHTML = this.template;

        this._domContext = parent.firstChild;

        this._createController();

        this._renderViews();
    }

    public getDOMContext(): HTMLElement {
        return this._domContext;
    }

    public deactivate() {
        if (this.onExit) {
            this.onExit(this);
        }

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

    private _createController() {
        let StateController = this.controller;

        if (StateController) {

            let scope = scopeFactory.create();

            this._stateController = new StateController(scope, this._data, this._domContext);
        }
    }

    private _renderViews() {
        if (!this.views) {
            return;
        }

        Object.keys(this.views).forEach(viewName => {
            let view = this.views[viewName];

            viewName = view.name || viewName;

            let container = this._domContext.querySelector(`[data-view="${viewName}"]`);

            if (container) {
                let div = document.createElement('div');
                div.innerHTML = view.template;

                container.parentElement.replaceChild(div.firstChild, container);
                div = null;

                let ViewController = view.controller;

                if (ViewController) {
                    let scope = scopeFactory.create();

                    this._viewsControllers.push(new ViewController(scope, this._data, container));
                }
            }

        });
    }

    private _setParent() {
        let stateParts = this.name.split('.');

        if (stateParts.length > 1) {
            this.parent = stateParts[0];
        }
    }
}