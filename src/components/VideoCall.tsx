// Import useState for managing call state
import { useState, useRef } from 'react';

export default function VideoCall() {
  // State: Is the call active?
  const [inCall, setInCall] = useState(false);
  // State: Is video enabled?
  const [videoEnabled, setVideoEnabled] = useState(true);
  // State: Is audio enabled?
  const [audioEnabled, setAudioEnabled] = useState(true);
  // Reference to the video element (so we can control it)
  const videoRef = useRef<HTMLVideoElement>(null);

  // Function: Start the call
  const startCall = async () => {
    setInCall(true);
    try {
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      // If videoRef exists, set its source to the stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      // If user denies permission, show alert
      alert("Camera/Microphone access denied. Please allow permissions.");
      setInCall(false);
    }
  };

  // Function: End the call
  const endCall = () => {
    setInCall(false);
    // Stop all tracks (camera + microphone)
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Function: Toggle video on/off
  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      // Get video tracks and toggle them
      stream.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  // Function: Toggle audio on/off
  const toggleAudio = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      // Get audio tracks and toggle them
      stream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Video Call
      </h3>
      
      {!inCall ? (
        // Show "Start Call" button when not in a call
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <button 
            onClick={startCall}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            Start Call
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Will request access to your camera and microphone
          </p>
        </div>
      ) : (
        // Show video UI when in a call
        <div>
          {/* Video element */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              className="w-full h-full object-cover"
            />
            {/* "Your camera is off" overlay */}
            {!videoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <p className="text-white text-sm">Camera is off</p>
              </div>
            )}
          </div>
          
          {/* Control buttons */}
          <div className="flex justify-center gap-3 mt-4">
            <button 
              onClick={toggleVideo}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                videoEnabled 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {videoEnabled ? 'Video On' : 'Video Off'}
            </button>
            
            <button 
              onClick={toggleAudio}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                audioEnabled 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              {audioEnabled ? 'Unmuted' : 'Muted'}
            </button>
            
            <button 
              onClick={endCall}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l-4 4m0 0l-4-4m4 4V2m0 14v2M5 12H3m16 0h-2M5 20h14" />
              </svg>
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
}