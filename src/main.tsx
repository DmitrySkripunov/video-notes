import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(`${import.meta.env.BASE_URL}sw.js`)
    .then(() =>
      navigator.serviceWorker.ready.then((worker) => {
        // @ts-ignore
        worker.sync.register("syncdata");
      })
    )
    .catch((err) => console.log(err));
}


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
