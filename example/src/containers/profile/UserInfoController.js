import { Controller } from '../../../../build'

export default class UserInfoController extends Controller {
    constructor(scope, stateData, domContext) {
        super(scope, stateData, domContext);

        console.log(scope);
    }
}