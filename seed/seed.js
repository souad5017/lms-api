import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Course from '../src/models/Course.js';
import Module from '../src/models/Module.js';
import Resource from '../src/models/Resource.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Resource.deleteMany({});
    await Module.deleteMany({});
    await Course.deleteMany({});

    const courses = await Course.insertMany([
      {
        title: 'JavaScript Moderne',
        description: 'Apprendre les bases et les fonctionnalités modernes de JavaScript.',
        objectives: [
          'Comprendre les bases de JavaScript',
          'Manipuler le DOM',
          'Utiliser async/await',
        ],
        level: 'beginner',
        category: 'JavaScript',
        duration: 20,
        status: 'published',
        trainer: 'Souad',
        publishedAt: new Date(),
      },
      {
        title: 'Node.js avec Express',
        description: 'Créer des API backend avec Node.js et Express.',
        objectives: [
          'Comprendre Node.js',
          'Créer un serveur Express',
          'Créer des routes API',
        ],
        level: 'intermediate',
        category: 'Backend',
        duration: 25,
        status: 'published',
        trainer: 'Aymane',
        publishedAt: new Date(),
      },
      {
        title: 'MongoDB et Mongoose',
        description: 'Découvrir MongoDB et manipuler les données avec Mongoose.',
        objectives: [
          'Comprendre MongoDB',
          'Créer des modèles Mongoose',
          'Manipuler les données',
        ],
        level: 'intermediate',
        category: 'Database',
        duration: 18,
        status: 'draft',
        trainer: 'Yassine',
      },
    ]);

    const modules = await Module.insertMany([
      {
        title: 'Introduction à JavaScript',
        description: 'Découvrir les fondamentaux de JavaScript.',
        order: 1,
        duration: 5,
        status: 'published',
        course: courses[0]._id,
      },
      {
        title: 'JavaScript asynchrone',
        description: 'Comprendre les Promises et async/await.',
        order: 2,
        duration: 7,
        status: 'published',
        course: courses[0]._id,
      },
      {
        title: 'Introduction à Express',
        description: 'Créer un serveur avec Express.',
        order: 1,
        duration: 8,
        status: 'published',
        course: courses[1]._id,
      },
      {
        title: 'Création des routes',
        description: 'Créer et organiser les routes API.',
        order: 2,
        duration: 10,
        status: 'published',
        course: courses[1]._id,
      },
      {
        title: 'Introduction à MongoDB',
        description: 'Découvrir les concepts fondamentaux de MongoDB.',
        order: 1,
        duration: 6,
        status: 'draft',
        course: courses[2]._id,
      },
    ]);

    await Resource.insertMany([
      {
        title: 'Cours JavaScript',
        type: 'article',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        description: 'Documentation JavaScript MDN.',
        order: 1,
        module: modules[0]._id,
      },
      {
        title: 'Async Await',
        type: 'video',
        url: 'https://example.com/videos/async-await',
        description: 'Introduction à async/await.',
        order: 1,
        module: modules[1]._id,
      },
      {
        title: 'Documentation Express',
        type: 'link',
        url: 'https://expressjs.com/',
        description: 'Documentation officielle Express.',
        order: 1,
        module: modules[2]._id,
      },
      {
        title: 'Exercices API',
        type: 'exercise',
        url: 'https://example.com/exercises/api',
        description: 'Exercices pratiques sur les API.',
        order: 1,
        module: modules[3]._id,
      },
      {
        title: 'Introduction MongoDB',
        type: 'pdf',
        url: 'https://example.com/files/mongodb.pdf',
        description: 'Support de cours MongoDB.',
        order: 1,
        module: modules[4]._id,
      },
    ]);

    console.log('Seed completed');

    await mongoose.disconnect();
  } catch (error) {
    console.error(error.message);
  }
};

seed();