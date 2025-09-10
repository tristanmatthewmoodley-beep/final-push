import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const ImageUpload = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 5, 
  multiple = true,
  className = '' 
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Check file types
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/');
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image file`);
      }
      return isValidType;
    });

    if (validFiles.length === 0) return;

    // Check total images limit
    if (images.length + validFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    uploadImages(validFiles);
  };

  const uploadImages = async (files) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      
      if (multiple && files.length > 1) {
        files.forEach(file => {
          formData.append('images', file);
        });
        
        const response = await api.post('/upload/multiple', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          const newImages = response.data.data.files.map((file, index) => ({
            url: `http://localhost:5000${file.url}`,
            alt: file.originalName,
            isPrimary: images.length === 0 && index === 0
          }));
          
          onImagesChange([...images, ...newImages]);
          toast.success(`${files.length} images uploaded successfully`);
        }
      } else {
        formData.append('image', files[0]);
        
        const response = await api.post('/upload/single', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          const newImage = {
            url: `http://localhost:5000${response.data.data.url}`,
            alt: response.data.data.originalName,
            isPrimary: images.length === 0
          };
          
          onImagesChange([...images, newImage]);
          toast.success('Image uploaded successfully');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    
    // If we removed the primary image, make the first remaining image primary
    if (images[index]?.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    
    onImagesChange(newImages);
  };

  const setPrimaryImage = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    onImagesChange(newImages);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
            <p className="text-gray-600 dark:text-gray-400">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              PNG, JPG, GIF up to 10MB {multiple && `(max ${maxImages} images)`}
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={image.url}
                  alt={image.alt || `Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=200&fit=crop';
                  }}
                />
              </div>
              
              {/* Image Controls */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                {!image.isPrimary && (
                  <button
                    onClick={() => setPrimaryImage(index)}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                    title="Set as primary image"
                  >
                    <ImageIcon size={16} />
                  </button>
                )}
                <button
                  onClick={() => removeImage(index)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
              
              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Upload Status */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {images.length} of {maxImages} images uploaded
      </div>
    </div>
  );
};

export default ImageUpload;
