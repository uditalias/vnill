import EventDispatcher from '../common/EventDispatcher'

export class Scope extends EventDispatcher {
    public watch(prop, handler, scope) {
        this.on(prop, handler, scope);
    }

    public unwatch(prop, handler, scope) {
        this.un(prop, handler, scope);
    }
}

function createScope() {

    let scope = new Scope();

    return new Proxy<Scope>(scope, {
        get: function (target, key) {
            return target[key];
        },

        set: function (target, key: string, value) {

            let oldVal = target[key];

            target[key] = value;

            scope.dispatch(key, value, oldVal);

            return true;
        },

        deleteProperty: function (target, key) {
            delete target[key];

            return true;
        }
    });
}

export default {
    create: () => createScope()
}