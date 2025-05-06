import { create } from 'ipfs-http-client';
import dotenv from 'dotenv';

dotenv.config();

const auth = 'Basic ' + Buffer.from(
  `${process.env.IPFS_PROJECT_ID}:${process.env.IPFS_PROJECT_SECRET}`
).toString('base64');

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export const uploadToIPFS = async (file: Buffer): Promise<string> => {
  const { cid } = await ipfs.add(file);
  return cid.toString();
};

export const getFromIPFS = async (cid: string): Promise<Buffer> => {
  const chunks = [];
  for await (const chunk of ipfs.cat(cid)) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};