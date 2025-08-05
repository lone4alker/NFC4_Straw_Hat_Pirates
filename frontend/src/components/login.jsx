import { useState, useEffect } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase';
import { User } from 'lucide-react';

const AuthForm = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const displayErrorMessage = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 5000);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const { email, password } = form;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        sendEmailVerification(user)
          .then(() => {
            alert('Verification Email Sent');
            window.location.replace('/login');
          })
          .catch((err) => displayErrorMessage(err.message));
      })
      .catch((err) => displayErrorMessage(err.message));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = form;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          window.location.replace('/ChatInterface');
        } else {
          displayErrorMessage('Please verify your email address first.');
        }
      })
      .catch(() => displayErrorMessage('Username or password incorrect'));
  };

  const handleForgotPassword = () => {
    if (!form.email) {
      displayErrorMessage('Please enter your email to reset password.');
      return;
    }
    sendPasswordResetEmail(auth, form.email)
      .then(() => alert('Reset link sent to your email id'))
      .catch((err) => displayErrorMessage(err.message));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-teal-100 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-purple-600 rounded-full p-4 shadow-lg text-white mb-2">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-purple-700">Join Our Community</h2>
          <p className="text-gray-600 text-sm text-center">Create your account and get started</p>
        </div>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form className="space-y-4">
          <InputField id="email" label="Email Address" value={form.email} onChange={handleChange} type="email" />
          <InputField id="password" label="Password" value={form.password} onChange={handleChange} type="password" />

          <div className="flex justify-between">
            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-md" onClick={handleSignUp}>Sign Up</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md" onClick={handleLogin}>Login</button>
          </div>

          <div className="text-center mt-4">
            <button type="button" className="text-purple-600 underline text-sm" onClick={handleForgotPassword}>Forgot Password?</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, id, value, onChange, type = 'text' }) => (
  <div>
    <label htmlFor={id} className="block mb-1 font-medium text-sm">{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
    />
  </div>
);

export default AuthForm;
