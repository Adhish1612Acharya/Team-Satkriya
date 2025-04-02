import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <BrowserRouter>   
      <AuthProvider>  
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <App />
      </LocalizationProvider>
      
      </AuthProvider>
    </BrowserRouter>
  // </StrictMode>,
)
