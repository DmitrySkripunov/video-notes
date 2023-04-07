import { MouseEvent, useEffect, useRef, useState } from 'react';
import css from './NotesList.module.css'
import ProgressVideo from './ProgressVideo';
import { TNoteValue } from '../../contexts/NotesContext';

type NoteProps = {
  note: TNoteValue,
  onRemove: () => void
}

const Note = ({note, onRemove}: NoteProps) => {
  const noteRef = useRef<HTMLLIElement>(null)
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [expanded]);

  const rootStyles = () => {
    const rect = noteRef.current?.getBoundingClientRect();
    if (!rect) return {};

    return expanded ? {
      'transform': `translate(-${rect.x}px, -${rect.y}px)`,
      'zIndex': '1',
      'width': '100vw',
      'height': '100vh'
    } : {}
  };


  const videoBlockStyles = () => {
    const landscape = window.innerWidth > window.innerHeight;
    const multiplier = landscape && expanded ? window.innerHeight : window.innerWidth;
    const size = `${multiplier * 0.8}px`;


    return expanded ? {
      'width': size,
      'height': size
    } : {};
  }

  const remove = (evt: MouseEvent) => {
    evt.stopPropagation();
    
    onRemove();
  }

  return (
    <li className={css.note} ref={noteRef} onClick={() => setExpanded(!expanded)} style={rootStyles()}>
      <div className={css.noteTopBorder} />
      <div className={css.noteBottomBorder} />

      <div className={css.videoBlock} style={videoBlockStyles()}>
        <ProgressVideo video={note.blob}/>
      </div>

      <div className={css.controls}>
        <span style={{fontSize: '12px'}}>
          {new Intl.DateTimeFormat('en-GB', { 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute:'numeric' 
            }).format(new Date(note.timestamp))}
          </span>
          <button style={{fontSize: '12px'}} onClick={remove}>Remove</button>
      </div>
    </li>
  );
};

export default Note;