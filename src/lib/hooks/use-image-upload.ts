'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { ImageCategory } from '@/lib/types/cloudinary';
import { uploadProfileImageAction } from '@/lib/actions/user/settings.actions';

export interface UseImageUploadOptions {
  /**
   * Image kategorisi
   */
  category: ImageCategory;
  
  /**
   * Upload tamamlandığında çağrılır
   */
  onUploadComplete?: (file: File, url: string) => void;
  
  /**
   * Upload hatası olduğunda çağrılır
   */
  onError?: (error: string) => void;
  
  /**
   * Auto upload - file seçilince otomatik upload yapar
   */
  autoUpload?: boolean;
}

export interface UseImageUploadReturn {
  /**
   * Seçili dosya
   */
  selectedFile: File | null;
  
  /**
   * Preview URL
   */
  previewUrl: string | null;
  
  /**
   * Upload durumu
   */
  isUploading: boolean;
  
  /**
   * Upload progress (0-100)
   */
  uploadProgress: number;
  
  /**
   * Hata mesajı
   */
  error: string | null;
  
  /**
   * Dosya seçme handler'ı
   */
  handleFileSelect: (file: File | null) => void;
  
  /**
   * Upload başlatma fonksiyonu
   */
  startUpload: () => Promise<string | null>;
  
  /**
   * Reset fonksiyonu
   */
  reset: () => void;
  
  /**
   * Set existing image URL
   */
  setExistingUrl: (url: string | null) => void;
}

export function useImageUpload(options: UseImageUploadOptions): UseImageUploadReturn {
  const { category, onUploadComplete, onError, autoUpload = false } = options;
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Start upload process
  const startUpload = useCallback(async (): Promise<string | null> => {
    if (!selectedFile) {
      const errorMsg = 'Yüklenecek dosya seçilmedi';
      setError(errorMsg);
      onError?.(errorMsg);
      return null;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      // Real upload implementation
      if (category === 'user-profile' || category === 'user-banner') {
        // Create FormData for server action
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('imageType', category === 'user-profile' ? 'profile' : 'banner');
        
        // Call server action
        const result = await uploadProfileImageAction(formData);
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        if (!result?.success || !result?.data?.secureUrl) {
          throw new Error(result?.error || 'Upload failed');
        }
        
        const uploadedUrl = result.data.secureUrl;
      } else {
        // For other categories, still simulate for now
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        const uploadedUrl = `https://res.cloudinary.com/aniwa/image/upload/v1234567890/${category}/uploaded-image.jpg`;
      }
      
      // Call completion callback
      onUploadComplete?.(selectedFile, uploadedUrl);
      
      toast.success('Görsel başarıyla yüklendi');
      
      return uploadedUrl;
      
    } catch (uploadError) {
      const errorMsg = uploadError instanceof Error 
        ? uploadError.message 
        : 'Görsel yükleme başarısız oldu';
        
      setError(errorMsg);
      onError?.(errorMsg);
      toast.error(errorMsg);
      
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, category, onUploadComplete, onError]);

  // Handle file selection
  const handleFileSelect = useCallback((file: File | null) => {
    setError(null);
    setSelectedFile(file);
    
    if (file) {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      // Clear preview
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  // Auto upload effect
  const [shouldAutoUpload, setShouldAutoUpload] = useState(false);
  
  useEffect(() => {
    if (autoUpload && selectedFile && shouldAutoUpload) {
      startUpload();
      setShouldAutoUpload(false);
    }
  }, [autoUpload, selectedFile, shouldAutoUpload, startUpload]);

  // Trigger auto upload when file is selected
  useEffect(() => {
    if (autoUpload && selectedFile) {
      setShouldAutoUpload(true);
    }
  }, [autoUpload, selectedFile]);
  
  // Reset function
  const reset = useCallback(() => {
    setSelectedFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
    
    // Clean up preview URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  }, [previewUrl]);
  
  // Set existing image URL
  const setExistingUrl = useCallback((url: string | null) => {
    setPreviewUrl(url);
    setSelectedFile(null);
    setError(null);
  }, []);
  
  return {
    selectedFile,
    previewUrl,
    isUploading,
    uploadProgress,
    error,
    handleFileSelect,
    startUpload,
    reset,
    setExistingUrl,
  };
}
