import React from 'react';

export type TNote = {
  key: string, value: Blob
}

const NotesContext = React.createContext<TNote[]>([]);

export default NotesContext;