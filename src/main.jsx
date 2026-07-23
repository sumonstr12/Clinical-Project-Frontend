import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import App2 from './App2.jsx'

// for reduxtoolkit strictmode ,convert to provider
import { Provider } from 'react-redux'
import { store } from './assets/utilities/store.js'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//     {/* <App2 /> */}
//   </StrictMode>,
// )


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
    {/* <App2 /> */}
  </Provider>,
)