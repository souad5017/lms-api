import Module from '../models/Module.js';

export async function getModules(req, res, next) {
  try {
    const modules = await Module.find();

    res.status(200).json(modules);
  } catch (error) {
    next(error);
  }
}

export async function getModulesByCourse(req, res, next) {
  try {
    const { id } = req.params;

    const modules = await Module.find({
      course: id,
      status: 'published'
    }).sort({ order: 1 });

    res.status(200).json(modules);
  } catch (error) {
    next(error);
  }
}