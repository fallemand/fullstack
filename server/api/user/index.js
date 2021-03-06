'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/count', auth.hasRole('admin'), controller.count);
router.get('/metadata', auth.isAuthenticated(), controller.metadata);
router.post('/recover', controller.recover);
router.post('/recover-password', controller.recoverPassword);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/activate', auth.hasRole('admin'), controller.activate);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);



module.exports = router;
