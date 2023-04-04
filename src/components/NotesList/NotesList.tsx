import Note from './Note';
import css from './NotesList.module.css'

const NotesList = () => (
  <ul className={css.root}>
    <Note />
  </ul>
);

export default NotesList;