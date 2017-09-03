import { Controller } from '../../../../../build'

export default class ProfileUserController extends Controller {
    constructor(stateData, rootDom) {
        super(stateData, rootDom);

        console.log(this.stateData)
    }
}