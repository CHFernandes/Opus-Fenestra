import { Router } from 'express';

import { CriteriaController } from './controllers/CriteriaController';
import { ProjectsController } from './controllers/ProjectsController';
import { OrganizationsController } from './controllers/OrganizationsController';
import { PersonsController } from './controllers/PersonsController';
import { PortfoliosController } from './controllers/PortfoliosController';

const routes = Router();

const criteriaController = new CriteriaController();
const projectsController = new ProjectsController();
const organizationsController = new OrganizationsController();
const personsController = new PersonsController();
const portfoliosController = new PortfoliosController();

routes.post('/organizations', organizationsController.create);
routes.get('/organizations', organizationsController.show);

routes.post('/persons', personsController.create);
routes.get('/persons', personsController.show);

routes.post('/portfolios', portfoliosController.create);
routes.get('/portfolios', portfoliosController.show);

routes.post('/criteria', criteriaController.create);
routes.get('/criteria', criteriaController.show);
routes.get('/criteria/:id', criteriaController.showById);
routes.put('/criteria/:id', criteriaController.updateById);
routes.delete('/criteria/:id', criteriaController.deleteById);

routes.post('/projects', projectsController.create);
routes.get('/projects', projectsController.show);
routes.get('/projects/:id', projectsController.showById);
routes.put('/projects/:id', projectsController.updateById);
routes.delete('/projects/:id', projectsController.deleteById);

export {routes};