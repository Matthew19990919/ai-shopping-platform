import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCamera, 
  faSpinner, 
  faExclamationTriangle,
  faImage,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { 
  validateImage,
  previewImage,
  resizeImage
} from '../../../services/multimodal/imageProcessingService';
import './MultiModalInput.css';

/**
 * 图片输入组件
 * @param {Object} props 组件属性
 * @param {Function} props.onImageUpload 图片上传回调
 * @param {Function} props.onProcessingChange 处理状态变化回调
 * @param {boolean} props.disabled 是否禁用
 * @param {string} props.className 自定义类名
 */
const ImageInput = ({ 
  onImageUpload, 
  onProcessingChange = () => {}, 
  disabled = false,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);
  
  // 处理状态变化
  React.useEffect(() => {
    onProcessingChange(isUploading);
  }, [isUploading, onProcessingChange]);
  
  // 处理图片选择
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      setErrorMessage('');
      
      // 验证图片
      const validation = validateImage(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      // 压缩和处理图片
      const resizedImage = await resizeImage(file, 1200, 1200);
      
      // 生成预览
      const preview = await previewImage(file);
      setPreviewUrl(preview);
      
      // 延迟调用回调，以显示预览
      setTimeout(() => {
        if (onImageUpload) {
          onImageUpload(resizedImage);
        }
        setIsUploading(false);
      }, 500);
    } catch (error) {
      setErrorMessage(error.message || '处理图片失败');
      setIsUploading(false);
      
      // 重置文件输入，允许再次选择同一文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // 处理图片上传触发
  const handleTriggerUpload = () => {
    if (disabled || isUploading) return;
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // 清除预览图片
  const clearPreview = () => {
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`image-input-wrapper ${className}`}>
      {/* 隐藏的文件输入 */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageSelect}
        style={{ display: 'none' }}
      />
      
      {/* 图片预览 */}
      {previewUrl && (
        <div className="image-preview-container">
          <img 
            src={previewUrl} 
            alt="预览" 
            className="image-preview"
          />
          <button 
            className="clear-preview-button"
            onClick={clearPreview}
            title="移除图片"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
      
      {/* 上传控制按钮 */}
      <button 
        className={`image-upload-button ${isUploading ? 'uploading' : ''}`}
        onClick={handleTriggerUpload}
        disabled={disabled || isUploading}
        title="上传图片"
      >
        {isUploading ? (
          <FontAwesomeIcon icon={faSpinner} spin />
        ) : previewUrl ? (
          <FontAwesomeIcon icon={faImage} />
        ) : (
          <FontAwesomeIcon icon={faCamera} />
        )}
      </button>
      
      {/* 上传提示 */}
      {isUploading && !errorMessage && (
        <div className="upload-status">处理图片中...</div>
      )}
      
      {/* 错误信息 */}
      {errorMessage && (
        <div className="image-error-message">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ImageInput;