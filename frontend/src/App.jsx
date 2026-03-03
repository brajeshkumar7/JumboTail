import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ShippingCalculatorPage } from './pages/ShippingCalculatorPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <div className="page">
          <Routes>
            <Route path="/" element={<Navigate to="/shipping" replace />} />
            <Route path="/shipping" element={<ShippingCalculatorPage />} />
            <Route path="*" element={<Navigate to="/shipping" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
