import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {
  onFile: (file: File) => void;
};

export default function UploadDropzone({ onFile }: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFile(acceptedFiles[0]);
      }
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'text/plain': [],
    },
    maxFiles: 1,
    onDrop,
  });

  return (
    <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition bg-white ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}>
      <input {...getInputProps()} />
      <p className="text-lg">Drag & drop your PDF, DOCX, or TXT file here,<br/>or click to select</p>
    </div>
  );
}
