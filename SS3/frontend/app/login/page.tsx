"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Refs for animations
  const leftRef = useRef(null);
  const formRef = useRef(null);
  const circleRefs = useRef([]);

  useEffect(() => {
    // Entrance Animation
    const tl = gsap.timeline();

    tl.fromTo(
      ".login-left-side",
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1 }
    )
      .fromTo(
        ".login-right-side",
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1 },
        "-=0.5"
      )
      .fromTo(
        ".animate-text",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1 },
        "-=0.5"
      );

    // Floating animation for background circles
    gsap.to(".floating-circle", {
      y: 20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      stagger: 0.5
    });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "admin" && password === "password123") {
      toast.success("Login successful!");
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      toast.error("Invalid username or password.");
    }
  };

  return (
    <main className="login-container">
      <div className="login-split">

        {/* LEFT SIDE - BRANDING */}
        <section className="login-left-side">
          {/* Background Decorative Elements */}
          <div className="solid-circle1 floating-circle"></div>
          <div className="solid-circle2 floating-circle"></div>
          <div className="solid-circle-outline1 floating-circle"></div>

          <div className="left-content">
            <div className="brand-header animate-text">
              <div className="logo-box"></div>
              <div>
                <h1 className="brand-title">GC – GMS</h1>
                <p className="brand-subtitle">Graduation Committee Portal</p>
              </div>
            </div>

            <div className="hero-text">
              <h2 className="main-headline animate-text">
                Graduation Management System
              </h2>
              <div className="yellow-divider animate-text"></div>
              <p className="description animate-text">
                Automated presentation builder and photo integration portal for the final list of approved graduating students.
              </p>
            </div>

            <div className="features-row animate-text">
              <div className="feature-pill">
                <span className="dot"></span> Awards Tracking
              </div>
              <div className="feature-pill">
                <span className="dot"></span> Automated PPT Builder
              </div>
              <div className="feature-pill">
                <span className="dot"></span> Smart Photo Matching
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE - FORM */}
        <section className="login-right-side">
          <div className="form-wrapper">
            <div className="welcome-header">
              <p className="green-welcome">Welcome Back!</p>
              <h2 className="form-title">Sign in to your account</h2>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <label>Username</label>
                <div className="input-field">
                  <i className="fa-solid fa-user"></i>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-field">
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <i className="fa-solid fa-eye eye-toggle"></i>
                </div>
              </div>

              <button type="submit" className="signin-btn">
                Sign In
              </button>
            </form>

            <p className="restriction-notice">
              Restricted access. Authorized VPAA and Graduation Committee accounts only
            </p>
          </div>

          <footer className="login-footer">
            © 2026 GC – GMS. All rights reserved.
          </footer>
        </section>

      </div>

      <ToastContainer theme="colored" />
    </main>
  );
}