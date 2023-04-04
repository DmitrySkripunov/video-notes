import { memo } from 'react'
import css from './Footer.module.css'
import mainLogo from '/main-logo.svg'
import externalLinkIcon from '/external-link.svg'


const Footer = memo(() => (
  <footer className={css.root}>
    <img src={mainLogo} className={css.logo} />
    <a href="https://skripunov.site" target="_blank" className={css.mainSiteLink}>
      <span>&copy; {(new Date()).getFullYear()} Dmitry Skripunov</span> <img src={externalLinkIcon} /></a>
  </footer>
));

export default Footer;