import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import CreateAccount from './pages/CreateAccount/CreateAccount'
import ProductByCategory from './pages/ProductByCategory/ProductByCategory'
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Payment from './pages/Payment/Payment'
import Cart from './pages/Cart/Cart'
import Support from './pages/Support/Support'
import Search from './pages/Search/Search'
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess'
import EditUser from './pages/EditUser/EditUser';

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function App() {

  return (

    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/category/:categoryId" element={<ProductByCategory />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/payment/:productId" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/support" element={<Support />} />
        <Route path="/search" element={<Search />} />
        <Route path="/edit-user" element={<EditUser />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
