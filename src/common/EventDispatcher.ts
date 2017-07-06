export default class EventDispatcher {

    protected _eventDispatcherCallbacks: { [index: string]: { fn: (...args: any[]) => any, scope?: any }[] };

    public on(name: string, fn: (...args: any[]) => any, scope: any) {

        if (!this._eventDispatcherCallbacks) {
            this._eventDispatcherCallbacks = {};
        }

        let callbacks = this._eventDispatcherCallbacks[name];

        if (!callbacks) {
            this._eventDispatcherCallbacks[name] = callbacks = [];
        }

        callbacks.push({
            fn: fn,
            scope: (scope || this),
        });

        return this;
    }

    public un(name: string, fn: (...args: any[]) => any, scope: any) {

        if (this._eventDispatcherCallbacks) {

            let callbacks = this._eventDispatcherCallbacks[name];

            if (callbacks && callbacks.length > 0) {

                for (let i = callbacks.length - 1; i >= 0; i--) {
                    let callback = callbacks[i];
                    if (callback.fn === fn && callback.scope === (scope || this)) {
                        callbacks.splice(i, 1);
                    }
                }
            }
        }

        return this;
    }

    protected dispatch(name: string, ...args: any[]): void {

        if (this._eventDispatcherCallbacks) {
            let callbacks = this._eventDispatcherCallbacks[name];


            if (callbacks) {

                for (let i = callbacks.length - 1; i >= 0; i--) {
                    let callback = callbacks[i];

                    if (callback && callback.fn && callback.scope) {
                        callback.fn.apply((callback.scope || this), args);
                    }
                }
            }
        }
    }

    protected removeAllListeners() {
        for (let event in this._eventDispatcherCallbacks) {
            let callbacks = this._eventDispatcherCallbacks[event];
            callbacks.length = 0;
        }

        this._eventDispatcherCallbacks = {};
    }
}