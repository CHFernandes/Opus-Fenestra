import { Router } from 'express';

import { CriteriaController } from './controllers/CriteriaController';
import { ProjectsController } from './controllers/ProjectsController';
import { OrganizationsController } from './controllers/OrganizationsController';
import { PersonsController } from './controllers/PersonsController';
import { PortfoliosController } from './controllers/PortfoliosController';
import { AuthenticationController } from './controllers/AuthenticationController';
import { EvaluationsController } from './controllers/EvaluationsController';

const routes = Router();

const criteriaController = new CriteriaController();
const projectsController = new ProjectsController();
const organizationsController = new OrganizationsController();
const personsController = new PersonsController();
const portfoliosController = new PortfoliosController();
const authenticationController = new AuthenticationController();
const evaluationsController = new EvaluationsController();

routes.post('/login', authenticationController.login);
routes.get('/login', authenticationController.getUser);

routes.post('/organizations', organizationsController.create);
routes.get('/organizations', organizationsController.show);
routes.get('/organizations/:id', organizationsController.showById);

routes.post('/persons', personsController.create);
routes.get('/personsOrganization/:id', personsController.show);
routes.get('/persons/:id', personsController.showById);
routes.put('/persons/:id', personsController.updateById);
routes.delete('/persons/:id', personsController.deleteById);

routes.post('/portfolios', portfoliosController.create);
routes.get('/portfolios', portfoliosController.show);
routes.get('/portfolios/:id', portfoliosController.showById);

routes.post('/criteria', criteriaController.create);
routes.get('/criteriaPortfolio/:id', criteriaController.show);
routes.get('/criteria/:id', criteriaController.showById);
routes.put('/criteria/:id', criteriaController.updateById);
routes.delete('/criteria/:id', criteriaController.deleteById);

routes.post('/projects', projectsController.create);
routes.get('/projectsPortfolio/:id', projectsController.show);
routes.get('/projects/:id', projectsController.showById);
routes.put('/projects/:id', projectsController.updateById);
routes.delete('/projects/:id', projectsController.deleteById);
routes.get('/registeredProjects/:id', projectsController.showRegistered);
routes.get('/registeredProject/:id', projectsController.showRegisteredProject);

routes.post('/evaluation', evaluationsController.evaluate);

export {routes};