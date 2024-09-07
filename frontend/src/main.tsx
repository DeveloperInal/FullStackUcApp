import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from "react-redux";
import {store} from './store/store.ts';
import './index.css'

const root = document.getElementById('root')

createRoot(root!).render(<Provider store={store}><App /></Provider>)
