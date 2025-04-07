import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMicrophone, 
  faStop, 
  faSpinner, 
  faVolumeUp,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { 
  startSpeechRecognition, 
  stopSpeechRecognition,
  startAudioRecording
} from '../../../services/multimodal/speechRecognitionService';
import './MultiModalInput.css';

/**
 * 音频输入组件
 * @param {Object} props 组件属性
 * @param {Function} props.onAudioInput 音频转文本结果回调 (已弃用)
 * @param {Function} props.onInputChange 将语音识别结果传递给输入框的回调
 * @param {Function} props.onProcessingChange 处理状态变化回调
 * @param {boolean} props.disabled 是否禁用
 * @param {string} props.className 自定义类名
 */
const AudioInput = ({ 
  onAudioInput, 
  onInputChange = () => {},
  onProcessingChange = () => {}, 
  disabled = false,
  className = ''
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [interimResult, setInterimResult] = useState('');
  const recorderRef = useRef(null);
  const visualizerRef = useRef(null);
  const canvasRef = useRef(null);
  
  // 初始化可视化器
  useEffect(() => {
    if (canvasRef.current && isRecording) {
      initAudioVisualizer();
    }
    return () => {
      // 清理录音资源
      stopRecording();
    };
  }, []);
  
  // 处理状态变化
  useEffect(() => {
    onProcessingChange(isProcessing);
  }, [isProcessing, onProcessingChange]);
  
  // 初始化音频可视化器
  const initAudioVisualizer = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    if (visualizerRef.current) {
      cancelAnimationFrame(visualizerRef.current);
    }
    
    function draw() {
      if (!isRecording) return;
      
      // 清空画布
      ctx.clearRect(0, 0, width, height);
      
      // 绘制波形效果
      ctx.fillStyle = '#4568dc';
      
      // 模拟声音波形
      const now = Date.now() / 1000;
      for (let i = 0; i < width; i += 5) {
        // 使用随机振幅和周期的正弦波
        const amp = 20 * Math.random() + 5;
        const period = 0.5 + Math.random() * 0.2;
        const phase = i / width * Math.PI * 2;
        
        const y = height / 2 + amp * Math.sin(now * 10 * period + phase);
        ctx.fillRect(i, y - 1, 3, 2);
      }
      
      visualizerRef.current = requestAnimationFrame(draw);
    }
    
    visualizerRef.current = requestAnimationFrame(draw);
  };
  
  // 停止录音和处理
  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    
    stopSpeechRecognition();
    
    if (visualizerRef.current) {
      cancelAnimationFrame(visualizerRef.current);
      visualizerRef.current = null;
    }
    
    setIsRecording(false);
  };
  
  // 处理语音输入开始
  const handleVoiceInput = () => {
    if (disabled) return;
    
    if (isRecording) {
      // 停止录音
      stopRecording();
      setIsProcessing(true);
    } else {
      // 开始录音
      setIsRecording(true);
      setErrorMessage('');
      setInterimResult('');
      
      // 初始化可视化器
      if (canvasRef.current) {
        initAudioVisualizer();
      }
      
      // 启动语音识别
      const success = startSpeechRecognition(
        // 临时结果回调
        (text) => {
          setInterimResult(text);
        },
        // 最终结果回调
        (finalText) => {
          setIsRecording(false);
          setIsProcessing(false);
          setInterimResult('');
          
          if (finalText) {
            // 将语音识别结果添加到输入框，而不是直接发送
            onInputChange(finalText);
          }
          
          stopRecording();
        },
        // 错误回调
        (error) => {
          setErrorMessage(error);
          setIsRecording(false);
          setIsProcessing(false);
          stopRecording();
        }
      );
      
      // 如果网页语音识别失败，尝试使用录音API
      if (!success) {
        try {
          recorderRef.current = startAudioRecording(
            // 数据块回调
            null,
            // 停止录音回调
            async (audioBlob) => {
              try {
                setIsProcessing(true);
                // 这里应该调用API进行音频识别
                // 实际项目中需实现recognizeAudioWithAPI方法
                // const text = await recognizeAudioWithAPI(audioBlob);
                
                // 模拟识别结果
                await new Promise(resolve => setTimeout(resolve, 1500));
                const mockResult = "我想找一款性价比高的智能手机";
                
                setIsProcessing(false);
                
                // 将模拟的语音识别结果添加到输入框，而不是直接发送
                onInputChange(mockResult);
              } catch (error) {
                setErrorMessage('语音识别失败: ' + error.message);
                setIsProcessing(false);
              }
            },
            // 错误回调
            (error) => {
              setErrorMessage('录音失败: ' + error.message);
              setIsRecording(false);
              setIsProcessing(false);
            }
          );
        } catch (error) {
          setErrorMessage('无法启动录音: ' + error.message);
          setIsRecording(false);
        }
      }
    }
  };

  return (
    <div className={`voice-input-wrapper ${className}`}>
      {/* 实时转录结果 */}
      {interimResult && (
        <div className="interim-result">
          <FontAwesomeIcon icon={faVolumeUp} className="interim-icon" />
          <span>{interimResult}</span>
        </div>
      )}
      
      {/* 录音控制按钮 */}
      <button 
        className={`voice-control-button ${isRecording ? 'recording' : ''} ${isProcessing ? 'processing' : ''}`}
        onClick={handleVoiceInput}
        disabled={disabled || isProcessing}
        title={isRecording ? '停止录音' : '开始语音输入'}
      >
        {isRecording ? (
          <FontAwesomeIcon icon={faStop} />
        ) : isProcessing ? (
          <FontAwesomeIcon icon={faSpinner} spin />
        ) : (
          <FontAwesomeIcon icon={faMicrophone} />
        )}
      </button>
      
      {/* 录音状态指示 */}
      {isRecording && (
        <div className="recording-indicator">
          <canvas 
            ref={canvasRef} 
            width={120} 
            height={40} 
            className="audio-visualizer"
          />
          <div className="recording-label">正在聆听...</div>
        </div>
      )}
      
      {/* 错误信息 */}
      {errorMessage && (
        <div className="audio-error-message">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default AudioInput;