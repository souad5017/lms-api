import Resource from '../models/Resource.js';

export async function getResources(req, res, next) {
  try {
    const resources = await Resource.find();

    res.status(200).json(resources);
  } catch (error) {
    next(error);
  }
}


export async function getResourcesByModule(req , res , next){
    try{
        const { moduleId } = req.params;

        const ressources = await Resource.find({
            module: moduleId
        }).sort({ order: 1})

        res.status(200).json(ressources);

    }catch( error){
        next(error)
    }
}