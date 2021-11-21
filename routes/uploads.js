var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');

const upload = multer({
  storage : multer.diskStorage({
    destination(req,file,done){
      done(null, 'uploads/')
    },
    filename(req,file,done){
      const ext = path.extname(file.originalname);
      done(null,path.basename(file.originalname,ext) + Date.now() + ext );
    },
  }),
  limit : {fileSize : 5 * 1024 * 1024}
});





/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', upload.single('image'), function(req, res, next) {
  //console.log(req.file)
  console.log(req.file)
});

module.exports = router;
