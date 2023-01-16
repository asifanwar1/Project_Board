const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();


require('../database/dbConnection');


router.get('/', (req, res) =>{
    res.send('home page router')
});


router.use(require('../controllers/googleSignin'))
router.use(require('../controllers/addTask'))
router.use(require('../controllers/friendRequest'))
router.use(require('../controllers/messages'))
router.use(require('../controllers/projects'))
router.use(require('../controllers/searchBar'))
router.use(require('../controllers/taskCategories'))
router.use(require('../controllers/notes'))






module.exports = router;