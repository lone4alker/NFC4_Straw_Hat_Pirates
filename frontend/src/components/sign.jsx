import React, { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
} from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { auth } from './firebase'; // adjust path as needed

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    industry: '',
    password: '',
    platform: '',
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

  const clearErrorMessage = () => setError('');

  const displayErrorMessage = (msg) => {
    setError(msg);
    setTimeout(clearErrorMessage, 5000);
  };

  const handleChange = (e) => {
    const { id, value, name, type } = e.target;
    if (type === 'radio') {
      setForm({ ...form, platform: value });
    } else {
      setForm({ ...form, [id || name]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const { email, password, name, platform, role, industry } = form;

  if (!platform) {
    displayErrorMessage('Please select a platform.');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userId = user.uid;

    await sendEmailVerification(user);

    const db = getDatabase();
    await set(ref(db, 'users/' + userId), {
      name,
      email,
      role,
      industry,
      platform,
      uid: userId,
    });

    alert('Verification email sent!');
    window.location.replace('/login.html');
  } catch (err) {
    displayErrorMessage(err.message);
  }
};


  return (
    <div
      className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url('https://t4.ftcdn.net/jpg/03/49/77/45/360_F_349774531_GVBujUQPMDHdptTix4m13kQ62Qgy4jiA.jpg')`,
      }}
    >
      {/* Left Side */}
      <div className="hidden md:flex items-center justify-center text-white ml-6">
        <div>
          <h1 className="text-5xl font-bold">Welcome!</h1>
          <p className="text-2xl mt-2">Be a new member</p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex justify-center items-center px-4 py-10">
        <div className="bg-white bg-opacity-90 shadow-xl rounded-xl w-full max-w-md p-8">
          <h3 className="text-center text-2xl font-semibold mb-6">
            Create a new account
          </h3>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Name" id="name" value={form.name} onChange={handleChange} />
            <InputField label="Email" id="email" type="email" value={form.email} onChange={handleChange} />
            <InputField label="Role" id="role" value={form.role} onChange={handleChange} placeholder="e.g., Student" />
            <InputField label="Industry" id="industry" value={form.industry} onChange={handleChange} />
            <InputField label="Password" id="password" type="password" value={form.password} onChange={handleChange} />

            {/* Platform Radio */}
            <div>
              <label className="block mb-1 font-medium">Platform</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="platform"
                    value="LinkedIn"
                    onChange={handleChange}
                  />
                  LinkedIn
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="platform"
                    value="X"
                    onChange={handleChange}
                  />
                  X
                </label>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </button>
            </div>

            <div className="text-center mt-4">
              <p>
                Already have an account?{''}
                <a href="/login" className="text-blue-600 underline">
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable input component
const InputField = ({ label, id, value, onChange, type = 'text', placeholder }) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

export default SignUp;
