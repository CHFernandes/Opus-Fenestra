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
            name,
            description,
            plannedStartDate,
            plannedEndDate
        } = request.body;


        try {
            const project = await singletonProject.getInstance().create(name, description, plannedStartDate, plannedEndDate);

            return response.json(project);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }

    }

    async show(request: Request, response: Response): Promise<Response> {
        const projectsList = await singletonProject.getInstance().list();
        return response.json(projectsList);
    }

    async showById(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        const projectsService = new ProjectsService();
        const list = await projectsService.findById(Number(id));

        return response.json(list);
    }

    async updateById(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        const {
            name,
            description,
            completion,
            plannedStartDate,
            plannedEndDate
        } = request.body;
        try {
            const updatedProject = await singletonProject.getInstance().updateById(Number(id), name, completion, description, plannedStartDate, plannedEndDate);

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

}

export {ProjectsController};