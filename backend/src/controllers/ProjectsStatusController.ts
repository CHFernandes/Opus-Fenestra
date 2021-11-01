import { Request, Response } from 'express';
import { ProjectsStatusService } from '../services/ProjectsStatusService';

const singletonProject = (function () {
    let instance: ProjectsStatusService;

    function createInstance() {
        const projectsStatusService = new ProjectsStatusService();
        return projectsStatusService;
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

class ProjectsStatusController {
    async lastChanged(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        try {
            const project = await singletonProject
                .getInstance()
                .findLastProjectChangedStatus(Number(id));

            return response.json(project);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async lastChangedById(
        request: Request,
        response: Response
    ): Promise<Response> {
        const { id } = request.params;

        try {
            const project = await singletonProject
                .getInstance()
                .findLastProjectChangedStatusByProject(Number(id));

            return response.json(project);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }
}

export { ProjectsStatusController };
