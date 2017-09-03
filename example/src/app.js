import { Router, Controller } from '../../build'
import * as states from 'containers/states'

window.router = new Router(states);

window.router.start();