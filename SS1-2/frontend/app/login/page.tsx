"use client"; // Required for Next.js 13+ app directory

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 13+ router
import { gsap } from "gsap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

export default function LoginPage() {
  const router = useRouter(); // initialize router

  // LEFT PANEL
  const leftRef = useRef<HTMLDivElement>(null);

  // Text elements
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const headTitleRef = useRef<HTMLHeadingElement>(null);
  const yellowLineRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);

  // Feature refs
  const feature1Ref = useRef<HTMLDivElement>(null);
  const feature2Ref = useRef<HTMLDivElement>(null);
  const feature3Ref = useRef<HTMLDivElement>(null);

  // Circle refs
  const circle1Ref = useRef<HTMLDivElement>(null);
  const circle2Ref = useRef<HTMLDivElement>(null);
  const circle3Ref = useRef<HTMLDivElement>(null);
  const circleOutline1Ref = useRef<HTMLDivElement>(null);
  const circleOutline2Ref = useRef<HTMLDivElement>(null);

  // RIGHT PANEL
  const formRef = useRef<HTMLDivElement>(null);

  // STATE FOR LOGIN
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ANIMATION EFFECT
  useEffect(() => {
    const textElements = [
      titleRef.current,
      subtitleRef.current,
      headTitleRef.current,
      yellowLineRef.current,
      subheadingRef.current,
      feature1Ref.current,
      feature2Ref.current,
      feature3Ref.current,
    ];

    // Reset elements to initial state
    textElements.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, y: 30 });
    });

    if (formRef.current) {
      gsap.set(formRef.current, { opacity: 0, x: 50 });
    }

    // Floating circles animation
    gsap.to(
      [circle1Ref.current, circle2Ref.current, circle3Ref.current, circleOutline1Ref.current, circleOutline2Ref.current],
      {
        y: "+=20",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 2,
        stagger: 0.3,
      }
    );

    // Animate text elements
    gsap.to(textElements, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
    });

    // Animate form
    if (formRef.current) {
      gsap.to(formRef.current, {
        opacity: 1,
        x: 0,
        duration: 1,
        delay: 0.8,
        ease: "power2.out",
      });
    }
  }, []);

  // CLIENT-SIDE LOGIN VALIDATION WITH DASHBOARD REDIRECT
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const validUsername = "admin";
    const validPassword = "password123";

    if (username === validUsername && password === validPassword) {
      toast.success("Login successful!");
      setTimeout(() => {
        router.push("/dashboard"); // redirect to dashboard
      }, 1000); // delay to show toast
    } else {
      toast.error("Invalid username or password.");
    }
  };

  return (
    <main className="login-page">
      <div className="login-separation">
        {/* LEFT SIDE */}
        <div className="login-left-side" ref={leftRef}>
          <div className="green-bg">
            {/* FLOATING CIRCLES */}
            <div className="solid-circle1" ref={circle1Ref}></div>
            <div className="solid-circle2" ref={circle2Ref}></div>
            <div className="solid-circle3" ref={circle3Ref}></div>
            <div className="solid-circle-outline1" ref={circleOutline1Ref}></div>
            <div className="solid-circle-outline2" ref={circleOutline2Ref}></div>

            <div className="logo">
              <div className="Title-container">
                <h1 className="Title" ref={titleRef}>GC - GMS</h1>
                <p className="Subtitle" ref={subtitleRef}>Registrar Portal</p>
              </div>

              <div className="Head-titles">
                <h1 className="Head-title1" ref={headTitleRef}>Graduation Management System</h1>
                <div className="yellow-line" ref={yellowLineRef}></div>
                <p className="subheading" ref={subheadingRef}>
                  Document verification & student tracking portal for the Office of the registrar.
                </p>
              </div>

              <div className="left-side-footer">
                <div className="feature-container">
                  <div className="features" ref={feature1Ref}>
                    <div className="yellow-circle"></div>
                    <p className="desc">Secure Access</p>
                  </div>
                  <div className="features2" ref={feature2Ref}>
                    <div className="yellow-circle"></div>
                    <p className="desc">Real-time Tracking</p>
                  </div>
                  <div className="features3" ref={feature3Ref}>
                    <div className="yellow-circle"></div>
                    <p className="desc">Document Verification</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right-side" ref={formRef}>
          <div className="login-form-title">
            <h1 className="login-title">Welcome Back!</h1>  
            <h1 className="login-subtitle">Sign in to your account</h1>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <i className="fa-solid fa-user input-icon"></i>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <i className="fa-solid fa-lock input-icon"></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-button">Sign In</button>
            <hr />
            <p className="signup-link">Restricted access. Authorized registrar accounts only</p>
            <p className="footer">© 2026 GC-GMS. All rights reserved.</p>
          </form>
        </div>
      </div>

      {/* Toastify container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </main>
  );
}