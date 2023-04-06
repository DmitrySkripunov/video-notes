import { useState, useRef, useEffect } from 'react'
import css from './App.module.css'
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import NotesList from './components/NotesList/NotesList';
import NotesContext, { TNote } from './contexts/NotesContext';

const RECORD_TIME_MILLISECONDS = 10000;
const UPDATE_PERIOD_MILLISECONDS = 200;

function App() {
  const [notes, setNotes] = useState<TNote[]>([]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const playerRef = useRef<HTMLVideoElement>(null);
  const player2Ref = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const progressIntervalRef = useRef<number>(0);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);

  useEffect(() => {
    navigator.mediaDevices
    .getUserMedia({audio: true, video: true})
    .then((stream) => {
      streamRef.current = stream;
      if (playerRef.current)
        playerRef.current.srcObject = streamRef.current;
    });
  }, []);

  const stopRecord = () => {
    recorderRef?.current?.stop();
    setRecording(false);
    setRecordingTime(0);
    clearInterval(progressIntervalRef.current);
  };

  const startRecord = () => {
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

        if (player2Ref.current) {
          player2Ref.current.src = URL.createObjectURL(blob);
        }
        //downloadLink.href = );
        //downloadLink.download = 'acetest.webm';
      });

      recorderRef.current.start();
      setRecording(true);
      progressIntervalRef.current = setInterval(() => {
        setRecordingTime(recordingTime => {
          if (recordingTime >= RECORD_TIME_MILLISECONDS) {
            stopRecord();
          }
          return recordingTime + UPDATE_PERIOD_MILLISECONDS
        });
      }, UPDATE_PERIOD_MILLISECONDS);
    }
  }


  useEffect(() => {
    const swMessages = ({data}: ExtendableMessageEvent) => {
      if (data.type === 'LOAD_NOTES_SUCCESS') {
        setNotes(data.result || []);
      } else if (data.type === 'ADD_NOTE_SUCCESS') {
        setNotes(notes => notes.concat(data.result));
      } else if (data.type === 'REMOVE_NOTE_SUCCESS') {
        setNotes(notes => notes.filter(note => note.key !== data.key));
      }
      //TODO: errors handlers
    };

    navigator?.serviceWorker?.addEventListener('message', swMessages);

    navigator?.serviceWorker?.controller?.postMessage({
      type: 'LOAD_NOTES'
    });

    return () => {
      navigator?.serviceWorker?.removeEventListener('message', swMessages);
    };
  }, [])

  const getTimerProgressStyle = () => {
    const angle = (360 * recordingTime) / RECORD_TIME_MILLISECONDS;

    return {
      'background': `conic-gradient(#646cff ${angle}deg, white 0deg)`
    };
  };

  const showPreview = () => {
    // setCount(count => count + 1);
  };

  const videoBlockStyles = `${css.videoBlock} ${expanded ? css.expanded : ''}`;

  const onRemoveNote = (key: string) => {
    if (confirm('Are you sure?')) {
      navigator?.serviceWorker?.controller?.postMessage({
        type: 'REMOVE_NOTE',
        key
      });
    }
  }

  return (
    <NotesContext.Provider value={notes} >
      <main className={css.root}>
        <Header onAddNote={showPreview} />
        <article>
          <div className={videoBlockStyles} onClick={() => setExpanded(!expanded)}>
            <div className={css.timerProgress} style={getTimerProgressStyle()}>
              <video className={css.videoElement} ref={playerRef} muted autoPlay></video>
            </div>
            
          </div>
          <button onClick={startRecord} >{recording ? 'stop record' : 'record'}</button> 


          <NotesList onRemoveNote={onRemoveNote} />
        </article>
        <Footer />
      </main>
    </NotesContext.Provider>
  )
}

export default App
