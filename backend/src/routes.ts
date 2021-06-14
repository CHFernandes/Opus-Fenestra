import { Router } from 'express';

import { CriteriaController } from './controllers/CriteriaController';
import { ProjectsController } from './controllers/ProjectsController';

const routes = Router();

const criteriaController = new CriteriaController();
const projectsController = new ProjectsController();

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