import 'react-image-crop/dist/ReactCrop.css';

import type { Crop } from 'react-image-crop';

import ReactCrop from 'react-image-crop';
import React, { useRef, useState } from 'react';

import { Dialog, Button, DialogTitle, DialogActions, DialogContent } from '@mui/material';

type ImageCropDialogProps = {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedImage: string) => void;
};

const ImageCropDialog: React.FC<ImageCropDialogProps> = ({
  open,
  imageSrc,
  onClose,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 100, height: 100, x: 0, y: 0 });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleCrop = () => {
    if (imageRef.current && completedCrop) {
      const canvas = document.createElement('canvas');
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      canvas.width = completedCrop.width!;
      canvas.height = completedCrop.height!;
      const ctx = canvas.getContext('2d');

      ctx!.drawImage(
        imageRef.current,
        completedCrop.x! * scaleX,
        completedCrop.y! * scaleY,
        completedCrop.width! * scaleX,
        completedCrop.height! * scaleY,
        0,
        0,
        completedCrop.width!,
        completedCrop.height!
      );

      // Return base64 string instead of blob URL
      const croppedBase64 = canvas.toDataURL('image/jpeg');
      onCropComplete(croppedBase64);
    }
    onClose();
    setCrop({ unit: '%', width: 100, height: 100, x: 0, y: 0 });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crop Image</DialogTitle>
      <DialogContent>
        <ReactCrop
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          style={{ width: '100%' }}
        >
          <img ref={imageRef} src={imageSrc} alt="Crop preview" style={{ width: '100%' }} />
        </ReactCrop>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button onClick={handleCrop} variant="contained" color="primary">
          Crop
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCropDialog;
