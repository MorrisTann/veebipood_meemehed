import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { ScrollToTop, ScrollRestore } from "./components/ScrollToTop";
import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage";
import ProductDetails from "./pages/ProductDetails";
import AboutProducts from "./pages/AboutProducts";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Account from "./pages/Account";
import AdminAccount from "./pages/AdminAccount";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Terms from "./pages/Terms";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

const DefaultLayout = () => (
  <div className="flex flex-col min-h-screen">
    <div className="flex-1">
      <Outlet />
    </div>
  </div>
);

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <ScrollToTop />
      <ScrollRestore />
      <div className="flex flex-col min-h-screen">
        <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<DefaultLayout />}>
            <Route path="/pood" element={<ProductsPage />} />
            <Route path="/tooted/:slug" element={<ProductDetails />} />
            <Route path="/toode" element={<AboutProducts />} />
            <Route path="/meist" element={<About />} />
            <Route path="/ostukorv" element={<Cart />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/konto"
              element={
                <ProtectedRoute>
                  {user?.email === "meemehed.kinnitus@gmail.com" ? (
                    <Navigate to="/admin" replace />
                  ) : (
                    <Account />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminAccount />
                </AdminRoute>
              }
            />
            <Route path="/payment" element={<Payment />} />
            <Route path="/success" element={<Success />} />
            <Route path="/muugi-ja-tagastustingimused" element={<Terms />} />
            <Route path="/unustasid-parooli" element={<ForgotPassword />} />
            <Route path="/muuda-parool/:token" element={<ResetPassword />} />

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
