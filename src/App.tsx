import { useState, MouseEvent, useEffect } from 'react'
import css from './App.module.css'
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import NotesList from './components/NotesList/NotesList';
import NotesContext, { TNote } from './contexts/NotesContext';
import Recorder from './components/Recorder/Recorder';

const MAX_NUMBER_NOTES = 5;

function App() {
  const [isRecorderOpen, setOpenRecorder] = useState(false);

  const [notes, setNotes] = useState<TNote[]>([]);

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


  const onRemoveNote = (key: string) => {
    if (confirm('Are you sure?')) {
      navigator?.serviceWorker?.controller?.postMessage({
        type: 'REMOVE_NOTE',
        key
      });
    }
  }

  const closeRecorder = (evt: MouseEvent | null) => {
    evt?.stopPropagation();
    setOpenRecorder(false);
  }

  const addNotes = () => {
    if (notes.length >= MAX_NUMBER_NOTES) {
      alert('At the moment, I do not recommend creating more than 5 notes.');
      return;
    }
    setOpenRecorder(true)
  };

  return (
    <NotesContext.Provider value={notes} >
      <main className={css.root}>
        <Header onAddNote={addNotes} />
        <article>
          <Recorder isOpen={isRecorderOpen} onClose={closeRecorder} />
          <NotesList onRemoveNote={onRemoveNote} />
        </article>
        <Footer />
      </main>
    </NotesContext.Provider>
  )
}

export default App
