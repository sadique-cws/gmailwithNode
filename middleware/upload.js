var multer = require("multer")
var path = require('path');

var folderName = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./images")
    },
    filename:(req,file,cb) => {
        cb(null,Date.now() + "_" + file.originalname)
    }
})

var upload =  multer({
    storage:folderName,
    fileFilter:(req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|pdf|zip/; // filetypes you will accept
        const mimetype = filetypes.test(file.mimetype); // verify file is == filetypes you will accept
        const extname = filetypes.test(path.extname(file.originalname)); // extract the file extension
        // if mimetype && extname are true, then no error
        if(mimetype && extname){
            return cb(null, true);
        }
        // if mimetype or extname false, give an error of compatibilty
        return cb("The uploaded file, isn't compatible :( we're sorry");
    }
})

module.exports = upload;