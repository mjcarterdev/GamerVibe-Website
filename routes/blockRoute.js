'use strict';
const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const blockingController = require('../controllers/blockingController');

router.route('/').
    get(blockingController.get_blocked_users_by_user).
    put([
        body('blockedId').trim().isInt()
    ], blockingController.block_user).
    delete([
      body('blockedId').trim().isInt()
    ], blockingController.unblock_user);

module.exports = router;