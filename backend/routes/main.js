import express from "express";
import authView from "../middleware/authView";
import {User} from "../models/user";
import multer from "multer";
import path from "path";
import fs from "fs";


const router = express.Router();
const upload = multer({
    dest: "./uploads"
});

router.get("/profile-image",authView,async function(req,res){
    const thisUser = await User.find({_id: req.user._id}).select({ profileImage:1 });
    const previousImage = thisUser[0].profileImage;
    const base64str = base64_encode(previousImage);
    // res.sendFile(base64str);
    res.send(base64str);
});
router.post("/upload",authView,upload.single("filepond" /* name attribute of <file> element in your form */),async function(req, res) {
        const tempPath = path.join(__dirname,"../"+req.file.path);
        const targetPath = path.join(__dirname, "../"+req.file.path+(path.extname(req.file.originalname).toLowerCase()));
        // console.log(tempPath.replace(/\\/g, '/'));
        // console.log(targetPath.replace(/\\/g, '/'));
        console.log(path+(path.extname(req.file.originalname).toLowerCase()));
        if (path.extname(req.file.originalname).toLowerCase() === ".png" ||path.extname(req.file.originalname).toLowerCase() === ".jpg"||path.extname(req.file.originalname).toLowerCase() === ".gif"||path.extname(req.file.originalname).toLowerCase() === ".gif") {

            const thisUser = await User.find({_id: req.user._id}).select({ profileImage:1 });
            const previousImage = thisUser[0].profileImage;

            User.update({ _id: req.user._id },{
                // mongodb update operators: https://docs.mongodb.com/manual/reference/operator/update/
                $set:{
                    profileImage:targetPath,
                }
            },async function () {
                if (previousImage){
                    fs.unlink(previousImage, err => {
                        if (err) return console.log(err);

                            fs.rename(tempPath, targetPath, err => {
                                // if (err) return console.log(err,1);

                                res
                                    .status(200)
                                    .contentType("text/plain")
                                    .end("File uploaded!");
                            });
                    });
                }else {
                    fs.exists(tempPath, (exists) => {
                        fs.rename(tempPath, targetPath, err => {
                            // if (err) return console.log(err,1);

                            res
                                .status(200)
                                .contentType("text/plain")
                                .end("File uploaded!");
                        });
                    });
                }

            });
        } else {
            fs.unlink(tempPath, err => {
                if (err) return console.log(err);

                res
                    .status(403)
                    .contentType("text/plain")
                    .end("Only .png files are allowed!");
            });
        }
    }
);

router.get("/",authView,async function (req,res) {
    // console.log(req.cookies["token"]);
    // res.render('index', { title: 'Hey', message: 'Hello there!' });
    res.render('index',{page:"index"});
});

router.get("/login",async function (req,res) {
    res.render('login',{page:"login"});
});

router.get("/messages",authView,async function (req,res) {
    res.render('messages',{page:"messages"});
});

router.get("/settings",authView,async function (req,res) {
    res.render('settings',{page:"settings"});
});


// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    let bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
export default router;