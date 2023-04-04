import { useState, useRef, useEffect } from 'react'
import vnotesLogo from '/vnotes.svg'
import css from './Header.module.css'

type HeaderProps = {
  onAddNote: () => void
};

export default function Header({onAddNote}: HeaderProps) {
  return (
    <header className={css.root}>
      <img src={vnotesLogo} className={css.logo} />
      <button onClick={onAddNote}>New Note</button>
    </header>
  )
}
