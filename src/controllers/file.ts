import fileServices from '../services/file';

const upload = async (req: any, res: any, next: any) => {  
  const type = req.params.type;
  if (req.files) {
    console.log('file: ', req.files.length, req.params.type);
    return fileServices.upload(req.files, type)
      .then(result => res.json(result))
      .catch(next);
  }

  return res.status(404).send();
};

export default {
  upload,
};
