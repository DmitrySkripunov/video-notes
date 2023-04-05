import { useContext } from 'react';
import Note from './Note';
import css from './NotesList.module.css'
import NotesContext from '../../contexts/NotesContext';

const NotesList = () => {
  const notes = useContext(NotesContext);

  const notesView = notes.map(({key, value}) => <Note key={key} video={value} />)

  return (
    <ul className={css.root}>
      {notesView}
    </ul>
  )
};

export default NotesList;