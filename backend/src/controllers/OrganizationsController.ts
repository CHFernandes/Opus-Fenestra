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

        const organization = await singletonOrganizations.getInstance().create(name, mission, values,vision);

        return response.json(organization);
    }

    async show(request: Request, response: Response): Promise<Response> {
        const organizationsList = await singletonOrganizations.getInstance().list();
        return response.json(organizationsList);
    }

}

export { OrganizationsController };