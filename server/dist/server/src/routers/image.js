import express from 'express';
import { RandomImageItemFactory } from '../../../common/src/core/items/randomImage.item.js';
import { ValidationError } from '../../../common/src/resources/errors.js';
export const getImageRouter = () => {
    const router = express.Router();
    router.get('/random', async (req, res) => {
        if (process.env.UNSPLASH_ACCESS_KEY == null) {
            throw new ValidationError('`process.env.UNSPLASH_ACCESS_KEY` is nullish! (".env" is probably either missing or incomplete)');
        }
        const item = await new RandomImageItemFactory(process.env.UNSPLASH_ACCESS_KEY).create();
        res.send(String(item));
    });
    return router;
};
