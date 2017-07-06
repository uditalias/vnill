import { cloneDeep, shallowEqual } from '../common/utils'
import Dispatcher from '../common/EventDispatcher'

export interface IDictionary<TValue> {
    [id: string]: TValue;
}

export interface Cords {
    top: number
    left: number
}

export class Component<Props> extends Dispatcher implements Component<Props> {

    protected $el: HTMLElement;
    protected children: Component<any>[];
    protected refs: IDictionary<Component<any>>;
    protected props: Props;

    private _watchers: IDictionary<Function>;
    private _hasWatchers: boolean;
    private _raf: number;

    constructor(props: Props = ({} as Props), element?: HTMLElement) {
        super();

        this.$el = element || null;
        this.children = [];
        this.refs = {};
        this.props = props;

        this._watchers = {};
        this._hasWatchers = false;
        this._raf = null;
    }

    public componentWillMount() {

    }

    public componentDidMount() {

    }

    public componentWillUnmount() {

    }

    public componentWillUpdate(newProps: Props) {

    }

    public componentDidUpdate(prevProps: Props) {

    }

    public shouldComponentUpdate(nextProps: Props) {
        return shallowEqual(this.props, nextProps);
    }

    public updateProps(nextProps: Props) {

        if (this.shouldComponentUpdate(nextProps) === false) {
            return;
        }

        this.componentWillUpdate(nextProps);

        let clonedPrevProps = cloneDeep(this.props);

        this.props = { ...(<any>clonedPrevProps), ...(<any>nextProps) } as Props;

        this.componentDidUpdate(clonedPrevProps);

        if (this._hasWatchers) {
            for (let prop in clonedPrevProps) {
                if (clonedPrevProps[prop] !== nextProps[prop] && typeof (this._watchers[prop]) === "function") {
                    this._watchers[prop](this.props[prop], clonedPrevProps[prop]);
                }
            }
        }
    }

    public addEventListener(event: string, listener: EventListener, flags?: any) {
        this.$el.addEventListener(event, listener, flags);
        return this;
    }

    public removeEventListener(event: string, listener: EventListener, flags?: any) {
        this.$el.removeEventListener(event, listener, flags);
        return this;
    }

    public toChildView(element: HTMLElement | string, ref?: string) {
        if (typeof element === 'string') {
            element = this.querySelector(element);
        }

        let view = new Component<any>({}, element);
        this.children.push(view);
        if (ref) {
            this.refs[ref] = view;
        }
        return view;
    }

    protected addWatcher(propName: string, fn: (newProp: any, oldProp: any) => {}) {
        this._hasWatchers = true;
        this._watchers[propName] = fn;
    }

    protected removeWatcher(propName: string) {
        delete this._watchers[propName];
        this._hasWatchers = Object.keys(this._watchers).length > 0;
    }

    protected setHtml(template: string) {

        this.componentWillMount();

        let wrapper = document.createElement('div');
        wrapper.innerHTML = template;

        this.$el = wrapper.firstChild as HTMLElement;

        wrapper.remove();

        wrapper = null;

        this.componentDidMount();

        return this;
    }

    public getDOMNode(): HTMLElement {
        return this.$el;
    }

    public querySelectorAll(selector: string): NodeList {
        return this.$el.querySelectorAll(selector);
    }

    public querySelector(selector: string): HTMLElement {
        return this.$el.querySelector(selector) as HTMLElement;
    }

    public addClass(className: string) {
        this.$el.classList.add(className);
        return this;
    }

    public removeClass(className: string) {
        this.$el.classList.remove(className);
        return this;
    }

    public toggleClass(className: string) {
        if (this.hasClass(className)) {
            return this.removeClass(className);
        } else {
            return this.addClass(className);
        }
    }

    public hasClass(className: string): boolean {
        return this.$el.classList.contains(className);
    }

    public setAttribute(key: string, value: string | number | boolean) {
        this.$el.setAttribute(key, value.toString());
        return this;
    }

    public getAttribute(key: string): string {
        return this.$el.getAttribute(key);
    }

    public removeAttribute(key: string) {
        this.$el.removeAttribute(key);
        return this;
    }

    public setStyle(key: string, value: string | number) {
        this.$el.style[key] = value.toString();
        return this;
    }

    public unsetStyle(key: string) {
        this.$el.style[key] = '';
        return this;
    }

    public appendTo(view: HTMLElement) {
        view.appendChild(this.$el);
        return this;
    }

    public prependTo(view: HTMLElement) {
        if (view.childNodes.length == 0) {
            return this.appendTo(view);
        } else {
            view.insertBefore(this.$el, view.childNodes[0]);
        }
        return this;
    }

    public appendToView(view: Component<any>) {
        return this.appendTo(view.$el);
    }

    public prependToView(view: Component<any>) {
        return this.prependTo(view.$el);
    }

    public getRect(): ClientRect {
        return this.$el.getBoundingClientRect();
    }

    public getCords(): Cords {
        var box = this.getRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return {
            top: Math.round(top),
            left: Math.round(left)
        } as Cords;
    }

    public snapTo(view: Component<any>) {
        let cords = view.getCords();
        let rect = view.getRect();

        this.setStyle('width', this.getCSSUnit(rect.width, 'px'));
        this.setStyle('height', this.getCSSUnit(rect.width, 'px'));
        this.setStyle('top', this.getCSSUnit(cords.top, 'px'));
        this.setStyle('left', this.getCSSUnit(cords.left, 'px'));

        return this;
    }

    protected getCSSUnit(value: string | number, unit: string = 'px'): string {
        return `${value.toString()}${unit}`;
    }

    public dispose() {
        this.componentWillUnmount();

        this._watchers = null;
        this.refs = null;

        for (let i = 0, len = this.children.length; i < len; i++) {
            this.children[i].dispose();
            this.children[i] = null;
        }

        this.$el.parentNode.removeChild(this.$el);
        this.$el = null;

        this.children.length = 0;
    }
}