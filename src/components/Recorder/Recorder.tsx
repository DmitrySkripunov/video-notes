import { MouseEvent, useEffect, useRef, useState } from 'react';
import css from './Recorder.module.css'

const RECORD_TIME_MILLISECONDS = 15000;
const RECORD_TIME_SECONDS = RECORD_TIME_MILLISECONDS / 1000;

export type TRecorderProps = {
  isOpen: boolean,
  onClose: (evt: MouseEvent | null) => void
}

const Recorder = ({isOpen, onClose}: TRecorderProps) => {
  const [isStreamReady, setIsStreamReady] = useState<boolean>(false);
  const playerRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      navigator.mediaDevices
      .getUserMedia({audio: true, video: true})
      .then((stream) => {
        streamRef.current = stream;
        if (playerRef.current)
          playerRef.current.srcObject = streamRef.current;
        
        setIsStreamReady(true);
      });
    } else {
      if (streamRef.current)
        streamRef.current.getTracks().forEach((track) => track.stop());

      setIsStreamReady(false);
    }
  }, [isOpen]);


  useEffect(() => {
    const timeupdate = () => {
      if (!recording) return;
      const time = (playerRef.current?.currentTime || 0) - recordingTime;

      if (time >= RECORD_TIME_SECONDS) {
        stopRecord();
        return;
      }
      
      const angle = (360 * time) / RECORD_TIME_SECONDS;

      if (progressRef.current)
        progressRef.current.style.background = `conic-gradient(#646cff ${angle}deg, white 0deg)`;
    };

    if(playerRef.current) {
      playerRef.current.addEventListener('timeupdate', timeupdate);
    }

    return () => {
      if(playerRef.current) {
        playerRef.current.removeEventListener('timeupdate', timeupdate);
      }
    };
  }, [playerRef.current, recording]);

  const stopRecord = () => {
    recorderRef?.current?.stop();
    recorderRef.current = null;
    setRecording(false);
    setRecordingTime(0);
    onClose(null);
  };

  const startRecord = () => {
    if(!isStreamReady) return;

    if (recording) {
      stopRecord()
      return;
    }
    if (streamRef.current) {
      const options = {mimeType: 'video/webm'};
      const recordedChunks: Blob[] = [];
      recorderRef.current = recorderRef.current ? recorderRef.current : new MediaRecorder(streamRef.current, options);

      recorderRef.current.addEventListener('dataavailable', function(e) {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      });

      recorderRef.current.addEventListener('stop', function() {
        const blob = new Blob(recordedChunks);
        navigator?.serviceWorker?.controller?.postMessage({
          type: 'ADD_NOTE',
          key: Date.now().toString(),
          blob 
        });
        //TODO: callback
      });

      recorderRef.current.start();
      setRecording(true);
      setRecordingTime(playerRef.current?.currentTime || 0);
    }
  }

  return (
    <div className={css.root} style={{display: isOpen ? 'flex' : 'none'}} onClick={startRecord}>
      <button className={css.closeButton} onClick={onClose}>Close</button>
      <div className={css.videoBlock}>
        <div className={css.timerProgress} ref={progressRef}>
          <video className={css.videoElement} ref={playerRef} muted autoPlay></video>
        </div>
        
      </div>
      {isStreamReady && recording && <span className={css.hint}>Tap to stop record and save</span>}
      {isStreamReady && !recording && <span className={css.hint}>Tap to start record</span>}
      {!isStreamReady && <span className={css.hint}>Preparing media devices...</span>}
    </div>
)};

export default Recorder;