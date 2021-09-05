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

        try {
            const person = await singletonPersons.getInstance().create(Number(organizationId), Number(personaId), email, name, password, user );

            return response.json(person);
        } catch (error){
            return response.status(400).json({
                message: error.message,
            });
        }
    }

    async show(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        const personsList = await singletonPersons.getInstance().list(Number(id));
        return response.json(personsList);
    }

    async showById(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        const person = await singletonPersons.getInstance().findById(Number(id));
        return response.json(person);
    }

    async updateById(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        const {
            organizationId,
            personaId,
            email,
            name,
            user,
            password,
            oldPassword
        } = request.body;

        const person = await singletonPersons.getInstance().updateById(Number(id), Number(organizationId), Number(personaId), email, name, user, oldPassword, password );

        return response.json(person);
    }

    async deleteById(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const responseDelete = await singletonPersons.getInstance().deleteById(Number(id));
            return response.json(responseDelete);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
        
    }

}

export { PersonsController };