/**
 * 语音识别服务
 * 提供语音输入和转文字功能
 */

// 检查浏览器是否支持语音识别API
const checkSpeechRecognitionSupport = () => {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition);
};

// 单例模式的语音识别实例
let recognitionInstance = null;

/**
 * 初始化语音识别服务
 * @returns {Object|null} 语音识别实例或null（如果不支持）
 */
const initSpeechRecognition = () => {
  if (!checkSpeechRecognitionSupport()) {
    console.error('当前浏览器不支持语音识别功能');
    return null;
  }

  // 创建识别实例
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
  const recognition = new SpeechRecognition();

  // 配置语音识别
  recognition.continuous = false; // 只进行一次识别
  recognition.interimResults = true; // 返回临时结果
  recognition.lang = 'zh-CN'; // 设置识别语言为中文
  recognition.maxAlternatives = 1; // 返回最可能的识别结果

  return recognition;
};

/**
 * 获取语音识别实例（单例模式）
 * @returns {Object|null} 语音识别实例或null
 */
const getSpeechRecognition = () => {
  if (!recognitionInstance) {
    recognitionInstance = initSpeechRecognition();
  }
  return recognitionInstance;
};

/**
 * 开始语音识别
 * @param {function} onInterimResult 临时结果回调
 * @param {function} onFinalResult 最终结果回调
 * @param {function} onError 错误回调
 * @returns {boolean} 是否成功启动
 */
export const startSpeechRecognition = (onInterimResult, onFinalResult, onError) => {
  try {
    const recognition = getSpeechRecognition();
    
    if (!recognition) {
      if (onError) onError('您的浏览器不支持语音识别功能，请使用Chrome浏览器尝试');
      return false;
    }
    
    // 清理旧的监听器
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    
    // 设置结果回调
    recognition.onresult = (event) => {
      const result = event.results[0];
      const transcript = result[0].transcript;
      
      if (result.isFinal) {
        if (onFinalResult) onFinalResult(transcript);
      } else {
        if (onInterimResult) onInterimResult(transcript);
      }
    };
    
    // 设置错误回调
    recognition.onerror = (event) => {
      console.error('语音识别错误:', event.error);
      if (onError) onError(`语音识别出错: ${event.error}`);
    };
    
    // 设置结束回调
    recognition.onend = () => {
      // 如果需要连续识别，可以在这里重新开始
      // recognition.start();
    };
    
    // 开始识别
    recognition.start();
    return true;
  } catch (error) {
    console.error('启动语音识别失败:', error);
    if (onError) onError(`启动语音识别失败: ${error.message}`);
    return false;
  }
};

/**
 * 停止语音识别
 */
export const stopSpeechRecognition = () => {
  try {
    const recognition = getSpeechRecognition();
    if (recognition) {
      recognition.stop();
    }
  } catch (error) {
    console.error('停止语音识别失败:', error);
  }
};

/**
 * 使用第三方语音识别API进行远程语音识别（备选方案）
 * @param {Blob} audioBlob 录制的音频数据
 * @returns {Promise<string>} 识别结果文本
 */
export const recognizeAudioWithAPI = async (audioBlob) => {
  try {
    // 创建FormData对象用于上传
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    
    // 发送请求到语音识别API
    // 注意：这里使用的是模拟API，实际使用时需要替换为真实的API端点
    const response = await fetch('/api/speech-recognition', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`语音识别请求失败: ${response.status}`);
    }
    
    const result = await response.json();
    return result.text || '';
  } catch (error) {
    console.error('API语音识别失败:', error);
    throw error;
  }
};

/**
 * 录制音频
 * @param {Function} onDataAvailable 数据可用时的回调
 * @param {Function} onStop 停止录制时的回调
 * @param {Function} onError 错误回调
 * @returns {Object} 录制控制器
 */
export const startAudioRecording = (onDataAvailable, onStop, onError) => {
  let mediaRecorder = null;
  let audioChunks = [];
  
  // 请求麦克风权限
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
          if (onDataAvailable) onDataAvailable(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        if (onStop) onStop(audioBlob);
        
        // 关闭所有轨道以释放麦克风
        stream.getTracks().forEach(track => track.stop());
      };
      
      // 开始录制
      mediaRecorder.start(100); // 每100ms生成一个数据块
    })
    .catch(error => {
      console.error('获取麦克风权限失败:', error);
      if (onError) onError(error);
    });
  
  // 返回控制器
  return {
    stop: () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
    },
    isRecording: () => mediaRecorder && mediaRecorder.state === 'recording'
  };
};

export default {
  checkSpeechRecognitionSupport,
  startSpeechRecognition,
  stopSpeechRecognition,
  recognizeAudioWithAPI,
  startAudioRecording
};