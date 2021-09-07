import { Request, Response } from 'express';
import { OrganizationsService } from '../services/OrganizationsService';

const singletonOrganizations = (function () {
    let instance: OrganizationsService;
 
    function createInstance() {
        const organizationService = new OrganizationsService();
        return organizationService;
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

class OrganizationsController {

    async create(request: Request, response: Response): Promise<Response> {
        const { 
            name,
            mission,
            values,
            vision
        } = request.body;

        try {
            const organization = await singletonOrganizations.getInstance().create(name, mission, values,vision);

            return response.json(organization);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async show(request: Request, response: Response): Promise<Response> {
        try {
            const organizationsList = await singletonOrganizations.getInstance().list();
            return response.json(organizationsList);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async showById(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const list = await singletonOrganizations.getInstance().findById(Number(id));

            return response.json(list);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

}

export { OrganizationsController };