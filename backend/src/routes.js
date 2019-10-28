import { Router } from 'express';
import multer from 'multer';

import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import MeetupController from './app/controllers/MeetupController';
import FileController from './app/controllers/FileController';
import ScheduleController from './app/controllers/ScheduleController';
import SubscriptionController from './app/controllers/SubscriptionController';

const routes = new Router();
const upload = multer(multerConfig);

// Sign up
routes.post('/users', UserController.store);
// Sign in
routes.post('/sessions', SessionController.store);

// Requisição token
routes.use(authMiddleware);

// User
routes.put('/users', UserController.update);

// File
routes.post('/files', upload.single('file'), FileController.store);
routes.delete('/files/:id', FileController.delete);

// Meetup
routes.get('/meetups', MeetupController.index);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:id', MeetupController.update);
routes.delete('/meetups/:id', MeetupController.delete);

// Schedule
routes.get('/schedules', ScheduleController.index);

// Subscription
routes.get('/subscriptions', SubscriptionController.index);
routes.post('/subscriptions', SubscriptionController.store);
routes.delete('/subscriptions/:id', SubscriptionController.delete);

export default routes;
