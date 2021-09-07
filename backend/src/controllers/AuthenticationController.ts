import { Request, Response } from 'express';
import { AuthenticationService } from '../services/AuthenticationService';

const singletonAuthentication = (function () {
    let instance: AuthenticationService;
 
    function createInstance() {
        const authenticationService = new AuthenticationService();
        return authenticationService;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

class AuthenticationController {

    async login(request: Request, response: Response): Promise<Response> {
        const { 
            user,
            password,
        } = request.body;

        const authentication = await singletonAuthentication.getInstance().login(user, password);

        return response.json(authentication);
    }

    async getUser(request: Request, response: Response): Promise<Response> {
        const authHeader = request.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        const user = await singletonAuthentication.getInstance().getUser(token);

        return response.json(user);
    }

}

export { AuthenticationController };