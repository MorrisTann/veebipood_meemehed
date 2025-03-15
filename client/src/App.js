import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet
} from "react-router-dom";
import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Account from "./pages/Account";
import NavBar from "./components/NavBar";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

// DefaultLayout teistele lehtedele
const DefaultLayout = () => {
  return <div className="container mx-auto p-4"><Outlet /></div>;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col h-screen">
            <div className="flex-none">
              <NavBar />
            </div>
            <div className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<DefaultLayout />}>
                  <Route path="/tooted" element={<ProductsPage />} />
                  <Route path="/tooted/:id" element={<ProductDetails />} />
                  <Route path="/meist" element={<About />} />
                  <Route path="/kontaktid" element={<Contact />} />
                  <Route path="/ostukorv" element={<Cart />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/konto" element={<Account />} />
                </Route>
              </Routes>
            </div>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
