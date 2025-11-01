'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  onError?: (error: string) => void;
}

export default function ImageUpload({ 
  onUploadComplete, 
  onError 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError?.('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError?.('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // TODO: Replace with actual Supabase upload
      // For now, using a placeholder URL
      // Once Supabase is set up, use:
      // const { data, error } = await supabase.storage
      //   .from('blog-images')
      //   .upload(`/${Date.now()}-${file.name}`, file);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, create a data URL (temporary solution)
      // In production, this will be replaced with Supabase Storage URL
      const reader = new FileReader();
      reader.onloadend = () => {
        clearInterval(progressInterval);
        setProgress(100);
        const result = reader.result as string;
        onUploadComplete(result);
        setUploading(false);
      };
      reader.readAsDataURL(file);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setUploading(false);
      setProgress(0);
      onError?.('Failed to upload image. Please try again.');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={uploading}
      >
        {uploading ? `Uploading ${progress}%` : 'Upload Image'}
      </Button>
      {uploading && (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

