import { Request, Response } from 'express';
import { PortfoliosService } from '../services/PortfoliosService';

const singletonPortfolio = (function () {
    let instance: PortfoliosService;
 
    function createInstance() {
        const portfoliosService = new PortfoliosService();
        return portfoliosService;
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

class PortfoliosController {

    async create(request: Request, response: Response): Promise<Response> {
        const { 
            organizationId,
            personId,
            description,
            objective,
        } = request.body;

        const organization = await singletonPortfolio.getInstance().create(Number(organizationId), Number(personId),description, objective);

        return response.json(organization);
    }

    async show(request: Request, response: Response): Promise<Response> {
        const portfoliosList = await singletonPortfolio.getInstance().list();
        return response.json(portfoliosList);
    }

}

export { PortfoliosController };