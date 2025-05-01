// app/components/ImageUploader.tsx
'use client';

import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Dragger } = Upload;

const ImageUploader = () => {
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: (file) => {
      // Implement your image processing logic here
      message.success(`${file.name} file uploaded successfully.`);
      return false; // Prevent automatic upload
    },
  };

  return (
    <Dragger {...props} style={{ padding: '16px' }}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag image to this area to upload</p>
      <p className="ant-upload-hint">Support for a single image upload.</p>
    </Dragger>
  );
};

export default ImageUploader;
