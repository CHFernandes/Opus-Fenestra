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
        },
    };
})();

class PortfoliosController {
    async create(request: Request, response: Response): Promise<Response> {
        const { organizationId, personId, description, objective } =
            request.body;

        try {
            const organization = await singletonPortfolio
                .getInstance()
                .create(
                    Number(organizationId),
                    Number(personId),
                    description,
                    objective
                );

            return response.json(organization);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async show(request: Request, response: Response): Promise<Response> {
        try {
            const portfoliosList = await singletonPortfolio
                .getInstance()
                .list();
            return response.json(portfoliosList);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async showById(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        try {
            const list = await singletonPortfolio
                .getInstance()
                .findById(Number(id));

            return response.json(list);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }
}

export { PortfoliosController };
