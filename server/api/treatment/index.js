'use strict';

var express = require('express');
var controller = require('./treatment.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/mine', auth.isAuthenticated(), controller.indexUser);
router.get('/metadata', auth.isAuthenticated(), controller.metadata);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id/status', auth.isAuthenticated(), controller.changeStatus);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
