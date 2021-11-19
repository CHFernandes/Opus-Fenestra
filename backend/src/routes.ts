import { Router } from 'express';

import { CriteriaController } from './controllers/CriteriaController';
import { ProjectsController } from './controllers/ProjectsController';
import { OrganizationsController } from './controllers/OrganizationsController';
import { PersonsController } from './controllers/PersonsController';
import { PortfoliosController } from './controllers/PortfoliosController';
import { AuthenticationController } from './controllers/AuthenticationController';
import { EvaluationsController } from './controllers/EvaluationsController';
import { ProjectsStatusController } from './controllers/ProjectsStatusController';
import { UnitiesController } from './controllers/UnitiesController';
import { CustomizedGradesController } from './controllers/CustomizedGradesController';

const routes = Router();

const criteriaController = new CriteriaController();
const projectsController = new ProjectsController();
const organizationsController = new OrganizationsController();
const personsController = new PersonsController();
const portfoliosController = new PortfoliosController();
const authenticationController = new AuthenticationController();
const evaluationsController = new EvaluationsController();
const projectsStatusController = new ProjectsStatusController();
const unitiesController = new UnitiesController();
const customizedGradesController = new CustomizedGradesController();

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
routes.get('/evaluatedProjects/:id', projectsController.showEvaluated);
routes.get(
    '/projectsEvaluations/:id',
    projectsController.showProjectsEvaluations
);
routes.get('/approvedProjects/:id', projectsController.showApproved);
routes.get('/registeredProject/:id', projectsController.showRegisteredProject);
routes.get(
    '/askForProjectInformation/:id',
    projectsController.showProjectsAskInformation
);
routes.get('/runningProjects/:id', projectsController.showRunningProjects);
routes.get('/projectsInRisk/:id', projectsController.showProjectsInRisk);
routes.get('/overdueProjects/:id', projectsController.showOverdueProjects);
routes.get('/stoppedProjects/:id', projectsController.showStoppedProjects);
routes.get('/finishedProjects/:id', projectsController.showFinishedProjects);
routes.get('/cancelledProjects/:id', projectsController.showCancelledProjects);
routes.put(
    '/askForProjectInformation/:id',
    projectsController.updateProjectAskInformation
);
routes.put('/acceptProject/:id', projectsController.acceptProject);
routes.put('/rejectProject/:id', projectsController.rejectProject);
routes.put('/beginProject/:id', projectsController.beginProject);
routes.put('/stopProject/:id', projectsController.stopProject);
routes.put('/restartProject/:id', projectsController.restartProject);
routes.put('/cancelProject/:id', projectsController.cancelProject);
routes.put('/finishProject/:id', projectsController.finishProject);
routes.get(
    '/getProjectsStatusQuantity/:id',
    projectsController.getProjectsStatusQuantity
);

routes.post('/evaluation', evaluationsController.evaluate);
routes.post('/updateEvaluation', evaluationsController.updateEvaluation);
routes.get(
    '/showLastEvaluations/:id',
    evaluationsController.showLastEvaluations
);

routes.get('/lastProjectsChanged/:id', projectsStatusController.lastChanged);
routes.get(
    '/lastProjectsChangedById/:id',
    projectsStatusController.lastChangedById
);

routes.post('/unit', unitiesController.create);
routes.put('/unit/:id', unitiesController.setBestAndWorst);
routes.put('/updateUnit/:id', unitiesController.updateById);
routes.get('/unitiesList', unitiesController.list);
routes.get('/unit/:id', unitiesController.getById);
routes.delete('/unit/:id', unitiesController.deleteById);

routes.post('/customizedGrades', customizedGradesController.create);
routes.put('/customizedGrades/:id', customizedGradesController.updateById);
routes.delete('/customizedGrades/:id', customizedGradesController.deleteById);

export { routes };
