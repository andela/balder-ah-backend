import express from 'express';
import { getAllTags, getTrendingTags } from '../controllers/tagsController';


const tagsRouter = express.Router();

tagsRouter.get('/tags', getAllTags);
tagsRouter.get('/tags/trending', getTrendingTags);


export default tagsRouter;
