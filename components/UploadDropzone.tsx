import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {
  onFile: (file: File) => void;
  disabled?: boolean;
};

export default function UploadDropzone({ onFile, disabled = false }: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!disabled && acceptedFiles.length > 0) {
        onFile(acceptedFiles[0]);
      }
    },
    [onFile, disabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'text/plain': [],
    },
    maxFiles: 1,
    onDrop,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={[
        'border-2 border-dashed rounded-2xl p-8 text-center transition bg-white',
        isDragActive && !disabled ? 'border-blue-500' : 'border-gray-300',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ].join(' ')}
    >
      <input {...getInputProps()} style={{ display: 'none' }} />
      {disabled
        ? 'Uploading… please wait'
        : 'Drag & drop your PDF, DOCX, or TXT file here, or click to select'}
    </div>
  );
}
