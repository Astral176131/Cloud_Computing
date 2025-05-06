import { Request, Response } from 'express';
import File from '../models/Files';
import { uploadToIPFS, getFromIPFS } from '../services/ipfsService';
import mongoose from 'mongoose';



export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { buffer, originalname, mimetype, size } = req.file;
    const cid = await uploadToIPFS(buffer);

    const file = new File({
      filename: originalname,
      size,
      cid,
      contentType: mimetype,
      owner: new mongoose.Types.ObjectId(req.user?.id)
    });

    await file.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: file._id,
        filename: file.filename,
        cid: file.cid,
        size: file.size,
        url: `https://ipfs.io/ipfs/${file.cid}`
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

export const getFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = await File.findOne({ 
      _id: req.params.id,
      owner: req.user?.id
    });
    
    if (!file) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const data = await getFromIPFS(file.cid);
    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.send(data);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
};

export const getUserFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = await File.find({ owner: req.user?.id });
    res.status(200).json(
      files.map(file => ({
        id: file._id,
        filename: file.filename,
        size: file.size,
        cid: file.cid,
        url: `https://ipfs.io/ipfs/${file.cid}`,
        uploadDate: file.uploadDate
      }))
    );
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};