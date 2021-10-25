var express = require('express');
var router = express.Router();
const boardController = require('../controllers/boards');


router.post('/', boardController.create);
router.put('/:id', boardController.update);



module.exports = router;
