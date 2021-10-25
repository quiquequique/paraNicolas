const Boards = require('../models/boards');

const boardController = {

    create: async (req, res) => {

        try{
            const payload = req.body;
            const createdProject = await Boards.create({...payload, stage: 1});
            if(createdProject) {

                let responce = {
                    id: createdProject.id,
                    title: createdProject.title,
                    stage:createdProject.stage
                }
                res.status(201).json(responce);
            }else{
                res.status(500).json({err:'server error'})
            }
        }catch(error){
            return error;
        }
    },
    update: async (req, res) => {
        try{
            let payload = req.body;
            let id = req.params.id;
            const updatedProject = await Boards.update(payload, {where: {id}});
    
            if(updatedProject && payload.stage <= 3){

                responce = await Boards.findByPk(id);
                res.status(200).json(responce);
            }else{
                res.status(400).json({updated: false})
            }

        }catch(error){
            res.status(500).json(error)
        }

    }
}
module.exports = boardController;

/**
 * Details about the stage
 * 1: TODO
 * 2: In Progress
 * 3: Completed
 */

