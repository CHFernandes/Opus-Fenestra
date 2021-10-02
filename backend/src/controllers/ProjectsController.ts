import { Request, Response } from 'express';
import { ProjectsService } from '../services/ProjectsService';

const singletonProject = (function () {
    let instance: ProjectsService;
 
    function createInstance() {
        const projectsService = new ProjectsService();
        return projectsService;
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

class ProjectsController {
    async create(request: Request, response: Response): Promise<Response>{
        const {
            portfolioId,
            submitter,
            name,
            description,
            plannedStartDate,
            plannedEndDate
        } = request.body;

        try {
            const project = await singletonProject.getInstance().create(Number(portfolioId), Number(submitter), name, description, plannedStartDate, plannedEndDate);

            return response.json(project);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }

    }

    async show(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const projectsList = await singletonProject.getInstance().list(Number(id));
            return response.json(projectsList);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async showById(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const list = await singletonProject.getInstance().findById(Number(id));

            return response.json(list);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async updateById(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        const {
            name,
            description,
            completion,
            plannedStartDate,
            plannedEndDate,
            status
        } = request.body;

        try {
            const updatedProject = await singletonProject.getInstance().updateById(Number(id), name, completion,description, plannedStartDate, plannedEndDate, Number(status));

            return response.json(updatedProject);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async deleteById(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const responseDelete = await singletonProject.getInstance().deleteById(Number(id));
            return response.json(responseDelete);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
        
    }

    async showRegistered(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const list = await singletonProject.getInstance().findRegisteredProjects(Number(id));

            return response.json(list);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async showRegisteredProject (request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const project = await singletonProject.getInstance().findRegisteredProject(Number(id));

            return response.json(project);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async showEvaluated(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const list = await singletonProject.getInstance().findEvaluatedProjects(Number(id));

            return response.json(list);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async showApproved(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const list = await singletonProject.getInstance().findApprovedProjects(Number(id));

            return response.json(list);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async showProjectsAskInformation(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const list = await singletonProject.getInstance().findAskedProjects(Number(id));

            return response.json(list);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async showRunningProjects(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const list = await singletonProject.getInstance().findRunningProjects(Number(id));

            return response.json(list);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async updateProjectAskInformation(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const project = await singletonProject.getInstance().askProjectMoreInformation(Number(id));

            return response.json(project);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async acceptProject(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const project = await singletonProject.getInstance().acceptProject(Number(id));

            return response.json(project);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async rejectProject(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const project = await singletonProject.getInstance().rejectProject(Number(id));

            return response.json(project);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async beginProject(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;

        const {
            responsibleId,
        } = request.body;

        try {
            const project = await singletonProject.getInstance().beginProject(Number(id), Number(responsibleId));

            return response.json(project);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async stopProject(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const project = await singletonProject.getInstance().stopProject(Number(id));

            return response.json(project);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async restartProject(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;

        try {
            const project = await singletonProject.getInstance().restartProject(Number(id));

            return response.json(project);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async cancelProject(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const project = await singletonProject.getInstance().cancelProject(Number(id));

            return response.json(project);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async finishProject(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const project = await singletonProject.getInstance().finishProject(Number(id));

            return response.json(project);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

}

export {ProjectsController};