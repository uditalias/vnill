import { Controller } from '../../../../../build'

export default class ProfileUserController extends Controller {
    componentDidMount() {
        console.log(this.scope);
    }
}