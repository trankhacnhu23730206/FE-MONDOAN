import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import CreateAccount from './pages/CreateAccount/CreateAccount'
import ProductByCategory from './pages/ProductByCategory/ProductByCategory'
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Payment from './pages/Payment/Payment'

function App() {

  return (

    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/category/:categorySlug" element={<ProductByCategory />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/payment/:productId" element={<Payment />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
