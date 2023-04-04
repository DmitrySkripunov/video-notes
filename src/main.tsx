import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(() =>
      navigator.serviceWorker.ready.then((worker) => {
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
