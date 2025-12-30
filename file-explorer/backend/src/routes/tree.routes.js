import express from 'express';
import { 
  getTree, 
  createFolder, 
  createFile, 
  renameNode, 
  deleteNode 
} from '../controllers/tree.controller.js';

const router = express.Router();

router.get('/tree', getTree);
router.post('/folder', createFolder);
router.post('/file', createFile);
router.put('/rename', renameNode);
router.delete('/node/:id', deleteNode);

export default router;
