import multer from 'multer';
import path from 'path';
import fs from 'fs';

const upload = multer({ dest: 'public/imgEmpresas' });

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, multer will handle it
  },
};

export default async function handler(req, res) {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred
      return res.status(500).json({ error: 'Multer error' });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ error: 'Unknown error' });
    }

    // File upload successful
    const imagePath = req.file.path;
    const imageName = req.file.originalname;

    // Move the uploaded file to the images folder
    const newPath = path.join('public/imgEmpresas', imageName);
    fs.renameSync(imagePath, newPath);

    // Respond with the image URL
    const imageUrl = `/${path.join('images', imageName)}`;
    res.status(200).json({ imageUrl });
  });
}
