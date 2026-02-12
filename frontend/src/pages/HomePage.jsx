import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/register';
    switch (user.role) {
      case 'student':
        return '/student/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/courses';
    }
  };

  return (
    <div className="homepage">
      <Navbar />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">

          <div className="hero-badge">
            <span></span> Online Learning Platform
          </div>

          <h1>
            Say hello to
            <span className="gradient-word">real learning</span>
          </h1>

          <p className="hero-subtitle">
            Connect with expert teachers and students in engaging online courses — anytime, anywhere.
          </p>

          <p className="hero-tagline">
            Learn skills — no barriers, just growth.
          </p>

          <div className="hero-form-cta">
            <Link
              to={getDashboardLink()}
              className="btn btn-primary btn-large"
            >
              {user ? 'Go to My Dashboard' : 'Get Started Free'} →
            </Link>
            <Link to="/courses" className="btn btn-outline btn-large">
              Browse Courses
            </Link>
          </div>
        </div>

        {/* kept for structural compatibility — hidden via CSS */}
        <div className="hero-image-container">
          <img
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2070"
            alt="Students and teachers in happy online video learning sessions"
            className="hero-image"
          />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">
            Learn the way that{' '}
            <span className="highlight">works for you</span>
          </h2>

          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🌍</span>
              <h3>Diverse Courses</h3>
              <p>Explore topics from programming to business — taught by passionate experts.</p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">🧑‍🏫</span>
              <h3>Expert Instructors</h3>
              <p>Learn from real teachers who care about your success and progress.</p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">📈</span>
              <h3>Track Your Progress</h3>
              <p>See your growth with clear analytics, quizzes, and personalized feedback.</p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">🏆</span>
              <h3>Earn Certificates</h3>
              <p>Finish strong and showcase verified certificates to boost your career.</p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">💬</span>
              <h3>Interactive &amp; Fun</h3>
              <p>Quizzes, discussions, assignments — learn by doing and connecting.</p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">📱💻</span>
              <h3>Learn Anywhere</h3>
              <p>Desktop, tablet, mobile — your courses go wherever you do.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>1000+</h3>
              <p>Active Learners</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Expert Teachers</p>
            </div>
            <div className="stat-item">
              <h3>100+</h3>
              <p>Quality Courses</p>
            </div>
            <div className="stat-item">
              <h3>95%</h3>
              <p>Happy Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="cta">
        <div className="container">
          <h2>Ready to start speaking the language of success?</h2>
          <p>Join thousands already growing on EduVillage — it's free to begin.</p>
          {!user && (
            <Link to="/register" className="btn btn-primary btn-large">
              Create Free Account
            </Link>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <span className="footer-brand">EduVillage</span>
            <p>Connecting Citizens Through Intelligent Innovation</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>For Educators</h4>
            <ul>
              <li><Link to="/register">Become a Teacher</Link></li>
              <li><Link to="/teacher/dashboard">Teacher Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} EduVillage. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;