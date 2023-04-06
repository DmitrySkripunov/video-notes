import { useContext } from 'react';
import Note from './Note';
import css from './NotesList.module.css'
import NotesContext from '../../contexts/NotesContext';

export type TNotesListProps = {
  onRemoveNote: (key: string) => void
}

const NotesList = ({onRemoveNote}: TNotesListProps) => {
  const notes = useContext(NotesContext);

  const notesView = notes.map(({key, value}) => <Note key={key} note={value} onRemove={() => onRemoveNote(key)} />)

  return (
    <ul className={css.root}>
      {notesView}
    </ul>
  )
};

export default NotesList;