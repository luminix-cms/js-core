import { HasFacadeAccessor, MakeFacade } from '@luminix/support';

import ErrorService from '../services/ErrorService';
import App from './App';

class ErrorFacade implements HasFacadeAccessor
{
    getFacadeAccessor(): string | object {
        return 'error';    
    }
}

const Error = MakeFacade<ErrorService, ErrorFacade>(ErrorFacade, App);


export default Error;
