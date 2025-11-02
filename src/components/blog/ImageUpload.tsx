'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui';
import { uploadBlogImage } from '@/lib/storage';
import toast from 'react-hot-toast';

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
      const errorMsg = 'Please select an image file';
      onError?.(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = 'Image size must be less than 5MB';
      onError?.(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Simulate upload progress (since Supabase doesn't provide real-time progress)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 150);

      // Upload to Supabase Storage
      const imageUrl = await uploadBlogImage(file);
      
      clearInterval(progressInterval);
      setProgress(100);

      // Small delay to show 100% completion
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Call the completion callback with the public URL
      onUploadComplete(imageUrl);
      setUploading(false);
      toast.success('Image uploaded successfully!');

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setUploading(false);
      setProgress(0);
      const errorMsg = error instanceof Error ? error.message : 'Failed to upload image. Please try again.';
      onError?.(errorMsg);
      toast.error(errorMsg);
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

