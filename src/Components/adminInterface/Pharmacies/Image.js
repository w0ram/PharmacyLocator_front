import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useState } from 'react';

const UploadImage = ({ onSaveImage }) => {
  const [file, setFile] = useState(null);

  

  

  return (
    <ImgCrop rotationSlider>
      <Upload
      name="photos"
      id="photos"
      maxCount={1}
      listType="picture"
      action="http://localhost:3000/Pharmacie"
      accept=".png,.PNG,.JPEG,.jpeg,.jpg"

      beforeUpload={(file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          console.log(dataUrl);
          setFile(dataUrl);
        };
        reader.readAsDataURL(file);
        return false;
      }}
      >
        {file ? null : '+ Upload'}
      </Upload>
    </ImgCrop>
  );
};

export default UploadImage;
