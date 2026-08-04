import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout/AppLayout';
import { HomePage } from './pages/HomePage/HomePage';
import { VariablesPage } from './pages/VariablesPage/VariablesPage';
import { VariableDetailsPage } from './pages/VariableDetailsPage/VariableDetailsPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/variables" element={<VariablesPage />} />
          <Route path="/variables/:variableId" element={<VariableDetailsPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  </StrictMode>
);
