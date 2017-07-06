/**
 * Support webpack.DefinePlugin
 */
declare var process: any;

interface IDictionary<TValue> {
    [id: string]: TValue;
}

interface Cords {
    top: number
    left: number
}

interface Component<Props> {
    new (props: Props, element?: HTMLElement): Component<Props>;
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillUpdate(): void;
    componentDidUpdate(): void;
    shouldComponentUpdate(): void;
    updateProps(nextProps: Props): void;
    addEventListener(event: string, listener: EventListener, flags?: any): void;
    removeEventListener(event: string, listener: EventListener, flags?: any): void;
    toChildView(element: HTMLElement | string, ref?: string): void;
    addWatcher(propName: string, fn: (newProp: any, oldProp: any) => {}): void;
    removeWatcher(propName: string): void;
    setHtml(template: string): void;
    getDOMNode(): HTMLElement;
    querySelectorAll(selector: string): NodeList;
    querySelector(selector: string): HTMLElement;
    addClass(className: string): void;
    removeClass(className: string): void;
    toggleClass(className: string): void;
    hasClass(className: string): boolean;
    setAttribute(key: string, value: string | number | boolean): void;
    getAttribute(key: string): string;
    removeAttribute(key: string): void;
    setStyle(key: string, value: string | number): void;
    unsetStyle(key: string): void;
    appendTo(view: HTMLElement): void;
    prependTo(view: HTMLElement): void;
    appendToView(view: Component<any>): void;
    prependToView(view: Component<any>): void;
    getRect(): ClientRect;
    getCords(): Cords;
    snapTo(view: Component<any>): void;
    getCSSUnit(value: string | number, unit: string): string
    dispose(): void;
}