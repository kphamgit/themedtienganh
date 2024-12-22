import 'regenerator-runtime/runtime'
//kpham: the above import 'regener...' has to be the first line due to error: can't find regeneratorRUntime
// when using react speech recognition package
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ThemeProvider from './contexts/theme_context/ThemeProvider.tsx'
import { Provider } from 'react-redux';
//import SocketContextComponent from './components/context/Socket/Component';
import { store, persistore } from './redux/store';
////import { PersistGate } from 'redux-persist/integration/react';
import SocketContextComponent from './contexts/socket_context/Component.tsx'


createRoot(document.getElementById('root')!).render(

     
    <ThemeProvider>
    <Provider store={store}>
    <App />
    </Provider>
    </ThemeProvider>
   

)

/*
 <Provider store={store}>
    <PersistGate loading={null} persistor={persistore}>
     
      <App />
    
    </PersistGate>
  </Provider>
*/