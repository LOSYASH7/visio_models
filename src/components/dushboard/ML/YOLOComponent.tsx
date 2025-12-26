import React, { useState, useRef } from 'react';
import './YOLOComponent.css';

interface Detection {
  class: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
}

const YOLOComponent: React.FC<{ user: any }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [error, setError] = useState<string>('');
  const [streamlitStatus, setStreamlitStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Адрес вашего Streamlit приложения
  const STREAMLIT_URL = 'http://localhost:8501';

  // Проверка статуса Streamlit
  const checkStreamlitStatus = async () => {
    try {
      const response = await fetch(`${STREAMLIT_URL}/health`, {
        method: 'GET',
        mode: 'cors',
      }).catch(() => null);

      if (response && response.ok) {
        setStreamlitStatus('online');
        setError('');
      } else {
        // Пробуем альтернативный endpoint или просто проверяем доступность
        try {
          const ping = await fetch(STREAMLIT_URL, { method: 'HEAD' });
          if (ping.ok) {
            setStreamlitStatus('online');
            setError('');
          } else {
            setStreamlitStatus('offline');
            setError('Streamlit YOLO app is not responding');
          }
        } catch {
          setStreamlitStatus('offline');
          setError('Cannot connect to Streamlit YOLO app');
        }
      }
    } catch {
      setStreamlitStatus('offline');
      setError('Cannot connect to Streamlit YOLO app');
    }
  };

  React.useEffect(() => {
    checkStreamlitStatus();
  }, []);

  // Отправка изображения в Streamlit
  const sendToStreamlitYOLO = async (imageFile: File) => {
    setProcessing(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      console.log('Sending to Streamlit:', `${STREAMLIT_URL}/detect`);
      
      // ВАЖНО: Streamlit обычно использует свои endpoints
      // Если у вас кастомный endpoint, укажите его здесь
      const response = await fetch(`${STREAMLIT_URL}/detect`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`Streamlit error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success || result.detections) {
        setDetections(result.detections || []);
        return result.detections || [];
      } else {
        throw new Error(result.error || 'Detection failed');
      }
    } catch (err) {
      console.error('Streamlit request error:', err);
      
      // Демо-данные если Streamlit недоступен
      if (err instanceof Error && err.message.includes('Failed to fetch')) {
        setError('Cannot connect to Streamlit. Using demo mode.');
        
        // Демо-детекции
        const demoDetections = [
          { class: 'person', confidence: 0.92, bbox: [120, 80, 150, 280] },
          { class: 'car', confidence: 0.87, bbox: [320, 200, 200, 120] },
          { class: 'dog', confidence: 0.78, bbox: [450, 180, 100, 120] },
        ];
        
        setDetections(demoDetections);
        return demoDetections;
      }
      
      setError(err instanceof Error ? err.message : 'Unknown error');
      setDetections([]);
      return [];
    } finally {
      setProcessing(false);
    }
  };

  // Альтернативный метод: если Streamlit принимает base64
  const sendToStreamlitBase64 = async (imageBase64: string) => {
    try {
      const response = await fetch(`${STREAMLIT_URL}/api/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageBase64 }),
        mode: 'cors',
      });
      
      return await response.json();
    } catch (error) {
      console.error('Base64 request error:', error);
      throw error;
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверяем размер файла
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError('Image size too large. Max 10MB');
      return;
    }

    // Показываем превью
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Устанавливаем размеры canvas
      const maxSize = 800;
      let width = img.width;
      let height = img.height;
      
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Очищаем и рисуем
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);
      
      // Отправляем в Streamlit
      sendToStreamlitYOLO(file).then(detections => {
        // Рисуем детекции после получения результатов
        drawDetectionsOnCanvas(detections);
      });
    };
    img.src = url;
  };

  // Рисование детекций на canvas
  const drawDetectionsOnCanvas = (detections: Detection[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Сохраняем текущее изображение
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Очищаем и перерисовываем
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
    
    // Рисуем детекции
    detections.forEach((det) => {
      const [x, y, w, h] = det.bbox;
      
      // Рисуем bounding box
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
      
      // Рисуем фон для текста
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px sans-serif';
      const text = `${det.class} ${(det.confidence * 100).toFixed(0)}%`;
      const textWidth = ctx.measureText(text).width;
      
      ctx.fillRect(x, y - 22, textWidth + 10, 20);
      
      // Рисуем текст
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, x + 5, y - 7);
    });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
        setActiveTab('camera');
      }
    } catch (error) {
      console.error('Camera error:', error);
      setError('Camera access denied. Please allow camera permissions.');
    }
  };

  const captureFromCamera = async () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Копируем кадр с камеры
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Конвертируем в файл
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      const file = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' });
      const detections = await sendToStreamlitYOLO(file);
      
      // Обновляем основной canvas
      const mainCanvas = canvasRef.current;
      if (mainCanvas && detections.length > 0) {
        mainCanvas.width = canvas.width;
        mainCanvas.height = canvas.height;
        const mainCtx = mainCanvas.getContext('2d');
        if (mainCtx) {
          mainCtx.drawImage(canvas, 0, 0);
          drawDetectionsOnCanvas(detections);
        }
      }
    }, 'image/jpeg');
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleReset = () => {
    setDetections([]);
    setError('');
    stopCamera();
    setActiveTab('upload');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="yoloContainer">
      <div className="yoloHeader">
        <h1 className="yoloTitle">YOLO Object Detection</h1>
        <p className="yoloSubtitle">
          Connected to Streamlit YOLO app on port 8501
        </p>
        
        <div className="serverStatus">
          <div className={`statusDot ${streamlitStatus === 'online' ? 'online' : 
                           streamlitStatus === 'offline' ? 'offline' : 'checking'}`} />
          <span className="statusText">
            {streamlitStatus === 'online' ? '✅ Streamlit YOLO Online' : 
             streamlitStatus === 'offline' ? '❌ Streamlit YOLO Offline' : 
             '⏳ Checking connection...'}
          </span>
          <button onClick={checkStreamlitStatus} className="refreshBtn" title="Refresh status">
            🔄
          </button>
        </div>
      </div>

      {error && (
        <div className="errorMessage">
          ⚠️ {error}
        </div>
      )}

      <div className="yoloContent">
        <div className="controlPanel">
          <div className="tabSelector">
            <button 
              className={`tabButton ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
              disabled={processing}
            >
              📁 Upload Image
            </button>
            <button 
              className={`tabButton ${activeTab === 'camera' ? 'active' : ''}`}
              onClick={isCameraActive ? stopCamera : startCamera}
              disabled={processing}
            >
              {isCameraActive ? '⏹️ Stop Camera' : '📷 Live Camera'}
            </button>
          </div>

          <div className="tabContent">
            {activeTab === 'upload' && (
              <div className="uploadSection">
                <div className="inputGroup">
                  <label className="inputLabel">Select Image</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="fileInput"
                    disabled={processing}
                  />
                  <p className="inputHint">
                    Image will be sent to Streamlit YOLO
                  </p>
                </div>
                
                <div className="streamlitInfo">
                  <p className="infoText">
                    <strong>Streamlit URL:</strong> {STREAMLIT_URL}
                  </p>
                  <p className="infoText">
                    <strong>Status:</strong> {
                      streamlitStatus === 'online' ? 'Connected' :
                      streamlitStatus === 'offline' ? 'Disconnected' : 'Checking'
                    }
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'camera' && isCameraActive && (
              <div className="cameraSection">
                <div className="cameraStatus">
                  <div className="statusDot active" />
                  <span className="statusText">Camera is active</span>
                </div>
                <button 
                  onClick={captureFromCamera}
                  className="captureBtn"
                  disabled={processing}
                >
                  📸 Capture & Detect
                </button>
                <p className="cameraHint">
                  Press to capture current frame and send to YOLO
                </p>
              </div>
            )}
          </div>

          <div className="resetSection">
            <button 
              onClick={handleReset} 
              className="resetButton"
              disabled={processing}
            >
              ↻ Reset All
            </button>
          </div>
        </div>

        <div className="previewArea">
          <div className="canvasWrapper">
            <canvas ref={canvasRef} className="previewCanvas" />
            
            {processing && (
              <div className="processingOverlay">
                <div className="spinner"></div>
                <p className="processingText">
                  Processing with YOLO...
                </p>
              </div>
            )}
            
            {!detections.length && !processing && activeTab === 'upload' && (
              <div className="emptyState">
                <div className="emptyIcon">🎯</div>
                <p className="emptyText">
                  {streamlitStatus === 'online' 
                    ? 'Upload an image for YOLO detection' 
                    : 'Start Streamlit YOLO app first'}
                </p>
              </div>
            )}
          </div>

          <div className="resultsPanel">
            <h3 className="resultsTitle">Detection Results</h3>
            
            <div className="resultsStats">
              <div className="statItem">
                <span className="statLabel">Objects found:</span>
                <span className="statValue">{detections.length}</span>
              </div>
              <div className="statItem">
                <span className="statLabel">Source:</span>
                <span className="statValue">
                  {activeTab === 'upload' ? 'Image Upload' : 'Camera'}
                </span>
              </div>
              <div className="statItem">
                <span className="statLabel">Backend:</span>
                <span className="statValue">Streamlit YOLO</span>
              </div>
            </div>

            <div className="detectionsList">
              {detections.length > 0 ? (
                detections.map((det, idx) => (
                  <div key={idx} className="detectionItem">
                    <div className="detectionHeader">
                      <span className="detectionClass">{det.class}</span>
                      <span className="detectionConfidence">
                        {(det.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="detectionBar">
                      <div 
                        className="detectionFill"
                        style={{ width: `${det.confidence * 100}%` }}
                      />
                    </div>
                    <div className="detectionBbox">
                      Position: {det.bbox.map(n => Math.round(n)).join(', ')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="noDetections">
                  <div className="noDetectionsIcon">🔍</div>
                  <p className="noDetectionsText">
                    {processing ? 'Processing...' : 'No objects detected yet'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <video ref={videoRef} style={{ display: 'none' }} playsInline />
    </div>
  );
};

export default YOLOComponent;