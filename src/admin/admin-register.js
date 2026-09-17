import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { db, auth } from '../firebaseConfig';

import styles from './admin-register.module.css';

const AdminRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    adminName: '',
    email: '',
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setLoading(true);

    try {
      /*
       * ---------------------------------------------------------
       * 1. Validate the form
       * ---------------------------------------------------------
       */

      if (
        !formData.adminName ||
        !formData.email ||
        !formData.username ||
        !formData.password
      ) {
        alert('Please fill in all fields');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address');
        return;
      }

      /*
       * Firebase Authentication requires a minimum
       * password length of 6 characters.
       */

      if (formData.password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      }

      /*
       * ---------------------------------------------------------
       * 2. Create the user in Firebase Authentication
       * ---------------------------------------------------------
       *
       * Firebase handles the password.
       *
       * We DO NOT store the password in Firestore.
       */

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      console.log('Firebase user created:', user.uid);

      /*
       * ---------------------------------------------------------
       * 3. Create the admin profile in Firestore
       * ---------------------------------------------------------
       *
       * Firebase Authentication gives us a unique UID.
       *
       * We use that UID as:
       *
       * admins/{uid}
       *
       * Notice that the password is NOT stored here.
       */

      const adminData = {
        uid: user.uid,
        adminName: formData.adminName,
        email: formData.email,
        username: formData.username,
        role: 'admin',
      };

      await setDoc(doc(db, 'admins', user.uid), adminData);

      /*
       * ---------------------------------------------------------
       * 4. Registration successful
       * ---------------------------------------------------------
       */

      alert('Admin registered successfully!');

      navigate('/login');

    } catch (error) {
      console.error('Registration error:', error);

      /*
       * ---------------------------------------------------------
       * Firebase Authentication errors
       * ---------------------------------------------------------
       */

      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already registered.');
      }

      else if (error.code === 'auth/invalid-email') {
        alert('The email address is invalid.');
      }

      else if (error.code === 'auth/weak-password') {
        alert('Password is too weak. Use at least 6 characters.');
      }

      /*
       * ---------------------------------------------------------
       * Firestore errors
       * ---------------------------------------------------------
       */

      else if (error.code === 'permission-denied') {
        alert(
          'Firebase Authentication succeeded, but Firestore denied the profile write. Check your Firestore rules.'
        );
      }

      else if (error.code === 'unavailable') {
        alert(
          'Firestore is currently unavailable. Please check your connection.'
        );
      }

      else {
        alert(`Registration failed: ${error.message}`);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.glassCard}>

        <h2 className={styles.title}>
          Admin Registration
        </h2>

        <form
          onSubmit={handleSubmit}
          className={styles.registerForm}
        >

          <div className={styles.formGroup}>
            <input
              type="text"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              placeholder="Admin Name"
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={styles.input}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

        </form>

        <p className={styles.loginLink}>
          Already have an account?{' '}

          <span onClick={() => navigate('/login')}>
            Login here
          </span>
        </p>

      </div>
    </div>
  );
};

export default AdminRegister;