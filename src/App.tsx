import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

// Layout
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Services from './pages/Services';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Invoicing from './pages/Invoicing';
import InvoiceManagementDemo from './pages/InvoiceManagementDemo';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
            <Route 
              path="invoicing" 
              element={
                <ProtectedRoute>
                  <Invoicing />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="invoice-demo" 
              element={<InvoiceManagementDemo />} 
            />
          </Route>
        </Routes>
      </Router>
    </I18nextProvider>
  );
}

export default App;