import { useEffect, useRef, useState } from 'react';
import css from './NotesList.module.css'
import ProgressVideo from './ProgressVideo';

type NoteProps = {
  video: Blob
}

const Note = ({video}: NoteProps) => {
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

    return {
      'width': landscape && expanded ? 'auto' : '80%',
      'height': landscape && expanded ? '80%' : 'auto'
    }
  }

  return (
    <li className={css.note} ref={noteRef} onClick={() => setExpanded(!expanded)} style={rootStyles()}>
      <div className={css.noteTopBorder} />
      <div className={css.noteBottomBorder} />

      <div className={css.videoBlock} style={videoBlockStyles()}>
        <ProgressVideo video={video}/>
      </div>
    </li>
  );
};

export default Note;