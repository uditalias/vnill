export class Controller {
    public scope: any;
    public stateData: any;
    public domContext: Element;

    constructor(scope: any, stateData: any, domContext: Element) {
        this.scope = scope;
        this.stateData = stateData || {};
        this.domContext = domContext;
    }

    public componentWillMount() {

    }

    public componentDidMount() {

    }

    public destroy() {
        this.scope = null;
        this.stateData = null;
    }
}

export interface IControllerConstructor {
    new(scope: any, stateData: any, domContext: Element): Controller
}