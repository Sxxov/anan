import { ICSuccessVerifyResponse } from '../../../common/src/resources/responses/verify/ic.verify.response.js';
import express from 'express';
import multer from 'multer';
import { AccountDB } from '../core/db/account.db.js';
export const getVerifyRouter = () => {
    const router = express.Router();
    const upload = multer({ storage: multer.memoryStorage() });
    router.post('/submit/ic', upload.single('ic'), async (req, res) => {
        const { token } = req.body;
        // maybe do some actual verification? xd
        await AccountDB.approveIdentityValidation(token);
        res.send(String(new ICSuccessVerifyResponse()));
    });
    return router;
};
