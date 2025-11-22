import React, { useState } from 'react';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --------------------- LOGIN FUNCTION ---------------------
  const login = async () => {
    console.log("Login Function Executed", formData);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        localStorage.setItem("auth-token", responseData.token);
        window.location.replace("/");
      } else {
        alert(responseData.error || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong during login. Please try again later.");
    }
  };

  // --------------------- SIGNUP FUNCTION ---------------------
  const signup = async () => {
    console.log("Signup Function Executed", formData);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username, // ✅ make sure backend expects this name
          email: formData.email,
          password: formData.password,
        }),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        localStorage.setItem("auth-token", responseData.token);
        window.location.replace("/");
      } else {
        // ✅ handle duplicate user or validation error
        if (
          responseData.error === "User already exists" ||
          responseData.errors === "User already exists" ||
          response.status === 400
        ) {
          alert("⚠️ An account already exists with this email address. Please login instead.");
        } else {
          alert(responseData.error || responseData.errors || "Signup failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong while signing up. Please try again later.");
    }
  };

  // --------------------- RENDER ---------------------
  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>

        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
              required
            />
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
            required
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <button onClick={() => (state === "Login" ? login() : signup())}>Continue</button>

        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span onClick={() => setState("Login")}>Login here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?{" "}
            <span onClick={() => setState("Sign Up")}>Click here</span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
