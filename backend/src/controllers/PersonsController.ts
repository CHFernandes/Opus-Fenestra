import { Request, Response } from 'express';
import { PersonsService } from '../services/PersonsService';

const singletonPersons = (function () {
    let instance: PersonsService;
 
    function createInstance() {
        const personsService = new PersonsService();
        return personsService;
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

class PersonsController {

    async create(request: Request, response: Response): Promise<Response> {
        const { 
            organizationId,
            personaId,
            email,
            name,
            password,
            user
        } = request.body;

        const organization = await singletonPersons.getInstance().create(Number(organizationId), Number(personaId), email, name, password, user );

        return response.json(organization);
    }

    async show(request: Request, response: Response): Promise<Response> {
        const personsList = await singletonPersons.getInstance().list();
        return response.json(personsList);
    }

}

export { PersonsController };