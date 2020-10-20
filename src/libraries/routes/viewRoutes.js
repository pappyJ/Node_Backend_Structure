const express = require('express');
const viewCntrl = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewCntrl.welcome);

module.exports = router;
