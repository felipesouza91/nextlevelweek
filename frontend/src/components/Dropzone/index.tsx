import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
import './styles.css';

const Dropzone: React.FC = () => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      <p>
        <FiUpload />
        Imagem do estabelecimento
      </p>
    </div>
  );
};

export default Dropzone;
