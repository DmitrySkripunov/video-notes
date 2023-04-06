import React from 'react';

export type TNoteValue = {
  blob: Blob,
  timestamp: number
}

export type TNote = {
  key: string, value: TNoteValue
}

const NotesContext = React.createContext<TNote[]>([]);

export default NotesContext;