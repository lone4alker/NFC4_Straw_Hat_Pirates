import { useState, useEffect } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { auth, database } from './firebase';

const AuthForm = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: ''
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

  const saveEntryToFirebase = (userId, firstname, lastname, callback) => {
    const db = getDatabase();
    set(ref(db, 'users/' + userId), {
      firstname,
      lastname
    })
      .then(() => callback && callback())
      .catch((error) => console.error('Error saving entry:', error));
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const { email, password, firstname, lastname } = form;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        sendEmailVerification(user)
          .then(() => {
            saveEntryToFirebase(user.uid, firstname, lastname, () => {
              alert('Verification Email Sent');
              window.location.replace('/login');
            });
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
          window.location.replace('/dashboard');
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
    <div className="min-h-screen grid md:grid-cols-2 bg-cover bg-no-repeat" style={{ backgroundImage: "url('https://t4.ftcdn.net/jpg/03/49/77/45/360_F_349774531_GVBujUQPMDHdptTix4m13kQ62Qgy4jiA.jpg')" }}>
      <div className="hidden md:flex items-center justify-center text-white ml-6">
        <div>
          <h1 className="text-5xl font-bold">Get Started!</h1>
          <p className="text-2xl mt-2">Have a good day</p>
        </div>
      </div>

      <div className="flex justify-center items-center px-4 py-10">
        <div className="bg-white bg-opacity-90 shadow-xl rounded-xl w-full max-w-md p-8">
          <h3 className="text-center text-2xl font-semibold mb-6">Create a new account / Login</h3>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form className="space-y-4">
            <InputField id="email" label="Email" value={form.email} onChange={handleChange} type="email" />
            <InputField id="password" label="Password" value={form.password} onChange={handleChange} type="password" />
            <InputField id="firstname" label="First Name" value={form.firstname} onChange={handleChange} />
            <InputField id="lastname" label="Last Name" value={form.lastname} onChange={handleChange} />

            <div className="flex justify-between">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md" onClick={handleSignUp}>Sign Up</button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md" onClick={handleLogin}>Login</button>
            </div>
            <div className="text-center mt-4">
              <button type="button" className="text-blue-600 underline" onClick={handleForgotPassword}>Forgot Password?</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, id, value, onChange, type = 'text' }) => (
  <div>
    <label htmlFor={id} className="block mb-1 font-medium">{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

export default AuthForm;
