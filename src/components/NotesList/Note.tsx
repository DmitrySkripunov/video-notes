import css from './NotesList.module.css'

const Note = () => (
  <li className={css.note}>
    <div className={css.noteTopBorder} />
    <div className={css.noteBottomBorder} />
    <div className={css.videoBlock}/>
  </li>
);

export default Note;