import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from './theme'
import { ConfirmProvider } from 'material-ui-confirm'

// Cấu hình react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Cấu hình Redux Store
import { Provider } from 'react-redux'
import { store } from '~/redux/store.js'

// Cấu hình react-router-dom với browserRouter
import { BrowserRouter } from 'react-router-dom'

// Cấu hình Redux-persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)

// kỹ thuật Inject Store
import { injectStore } from '~/utils/authorizeAxios.js'
injectStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider
            defaultOptions={{
              allowClose: false,
              dialogProps: { maxWidth: 'xs' },
              confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
              cancellationButtonProps: { color: 'inherit' },
              buttonOrder: ['confirm', 'cancel']
            }}
          >
            <CssBaseline />
            <App />
            <ToastContainer position="bottom-left" theme="colored" />
          </ConfirmProvider>
        </CssVarsProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
