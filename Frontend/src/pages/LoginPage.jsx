import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../components/ToastProvider.jsx";
import Logo from "../components/Logo.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, login, signup, logout } = useAuth();
  const { showToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLogin) {
      if (!form.email || !form.password) {
        showToast("Please enter both email and password.", "error");
        return;
      }

      const result = await login(form.email, form.password);
      if (!result.ok) {
        showToast(result.message || "Invalid credentials. Check your email and password.", "error");
        return;
      }

      showToast("Welcome back!", "success");
      const nextPath = result.role === "admin" ? "/admin/overview" : "/reception/patients";
      navigate(nextPath, { replace: true });
    } else {
      if (!form.name || !form.email || !form.password || !form.confirmPassword) {
        showToast("Please fill in all fields.", "error");
        return;
      }

      if (form.password !== form.confirmPassword) {
        showToast("Passwords do not match!", "error");
        return;
      }

      const result = await signup(form.name, form.email, form.password);
      if (!result.ok) {
        showToast(result.message, "error");
        return;
      }

      showToast("Signup successful! You can now sign in.", "success");
      setIsLogin(true);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 bg-gradient-to-br from-herbal-50 via-green-50 to-herbal-100 overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-herbal-200/30 rounded-full blur-3xl floating-element"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-green-200/30 rounded-full blur-3xl floating-element" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-herbal-300/20 rounded-full blur-2xl floating-element" style={{animationDelay: '2s'}}></div>
      
      <div className="relative grid max-w-5xl items-center gap-10 lg:grid-cols-2 z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-herbal-600 to-herbal-700 px-4 py-2 rounded-full shadow-glow"
          >
            <Logo size="md" />
            <p className="text-sm uppercase font-bold tracking-[0.3em] text-white">
              Shree Sanjeevni
            </p>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl font-bold gradient-text lg:text-5xl leading-tight"
          >
            Ayurvedic Customer Care, simplified.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-sm text-gray-600 leading-relaxed"
          >
            Manage appointments, therapies, and service notes in a calm, modern
            interface designed for Ayurvedic clinics.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex gap-4 items-center text-xs text-gray-500"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-600"></span>
              <span>Easy Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-600"></span>
              <span>Patient Management</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-600"></span>
              <span>Reports</span>
            </div>
          </motion.div>
        </motion.div>
        <motion.form 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit} 
          className="relative bg-white/90 backdrop-blur-md shadow-lift rounded-2xl space-y-5 p-8 border border-herbal-200/50 overflow-hidden"
        >
          {/* Decorative corner element */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-herbal-400/20 to-green-400/20 rounded-full blur-2xl"></div>
          
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p className="text-xs text-gray-500">
              {isLogin ? "Sign in to continue to PanchKarma." : "Register to start managing patients."}
            </p>
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@clinic.com"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-herbal-600 to-herbal-700 px-5 py-3 text-sm font-bold text-white transition-all hover:shadow-glow-lg shadow-soft"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </motion.button>

          <p className="text-center text-xs text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-herbal-700 hover:text-herbal-600 hover:underline transition-colors"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default LoginPage;
