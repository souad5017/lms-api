import Course from '../models/Course.js';

export async function getCourses(req, res, next) {
  try {
    const { search, level, category, sort } = req.query;

    const filter = {
      status: 'published'
    };

    if (search) {
      filter.title = {
        $regex: search,
        $options: 'i'
      };
    }

    if (level) {
      filter.level = level;
    }

    if (category) {
      filter.category = category;
    }

    let sortOption = {};

    if (sort === 'createdAt') {
      sortOption.createdAt = -1;
    }

    if (sort === 'publishedAt') {
      sortOption.publishedAt = -1;
    }

    const courses = await Course.find(filter).sort(sortOption);

    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
}

export async function getCourseById(req, res, next) {
  try {
    const { id } = req.params;

    const course = await Course.findOne({
      _id: id,
      status: 'published'
    });

    if (!course) {
      return res.status(404).json({
        message: 'Course not found'
      });   
    }

    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
}
