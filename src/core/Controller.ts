export class Controller {
    public scope: any;
    public stateData: any;

    constructor(scope: any, stateData: any, domContext: HTMLElement) {
        this.scope = scope;
        this.stateData = stateData || {};
    }

    public destroy() {
        this.scope = null;
        this.stateData = null;
    }
}