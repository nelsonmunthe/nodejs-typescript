import express, { Request, Response, NextFunction } from "express";
import MigrationDataController from "../modules/migrationData/MigrationDataController";
import multer from "multer"
import fs from "fs"
import path from  "path";

// Configure storage for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, './../assets/')); // Files will be saved in the 'uploads/' directory
    },
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, file.originalname); // Unique filename
    }
});

const upload = multer({ storage: storage });
fs.mkdirSync(path.join(__dirname, './../assets/'), { recursive: true });

const router =  express.Router();

router.post('/customer-verification',  upload.single('file'), async (req: Request, res: Response, next : NextFunction) => {
    try {
        await new MigrationDataController().customerVerification(req, res, next)
    } catch (error) {
        next(error)
    }
})

router.post('/upload-document', async (req: Request, res: Response, next : NextFunction) => {
    try {
        await new MigrationDataController().uploadDocument(req, res, next)
    } catch (error) {
        next(error)
    }
})

router.post('/custumer-verification-document', async (req: Request, res: Response, next : NextFunction) => {
    try {
        await new MigrationDataController().customerVerificationDocument(req, res, next)
    } catch (error) {
        next(error)
    }
})



export default router;
