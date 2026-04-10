import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Support.css";

export default function Support() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="support-page">
      <div className="support-container">
        <div className="support-header">
          <div>
            <h1>Support Center</h1>
            <p>Need help? Send us a message and our support team will get back to you soon.</p>
          </div>
          <button className="support-back-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>

        <div className="support-grid">
          <section className="support-main card">
            <div className="support-panel">
              <h2>Contact Support</h2>
              <p>Fill out the form below and we will respond within 24 hours.</p>
            </div>

            {submitted && (
              <div className="support-feedback">
                <strong>Thank you!</strong>
                <p>Your request has been submitted. Our team will reply to your email shortly.</p>
              </div>
            )}

            <form className="support-form" onSubmit={handleSubmit}>
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Subject
                <input
                  type="text"
                  name="subject"
                  placeholder="What can we help you with?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Message
                <textarea
                  name="message"
                  placeholder="Describe your issue or question"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                />
              </label>

              <button className="support-submit-btn" type="submit">
                Send Message
              </button>
            </form>
          </section>

          <aside className="support-side card">
            <div className="support-info">
              <h3>Need Immediate Help?</h3>
              <p>Contact us through one of the following support channels.</p>
            </div>

            <div className="support-contact-list">
              <div className="support-contact-item">
                <span>📧</span>
                <div>
                  <strong>Email</strong>
                  <p>support@vtech.example</p>
                </div>
              </div>
              <div className="support-contact-item">
                <span>📞</span>
                <div>
                  <strong>Phone</strong>
                  <p>+84 1234 567 890</p>
                </div>
              </div>
              <div className="support-contact-item">
                <span>💬</span>
                <div>
                  <strong>Live Chat</strong>
                  <p>Available 9:00 - 18:00</p>
                </div>
              </div>
            </div>

            <div className="support-cta-card">
              <h4>Support Hours</h4>
              <p>Mon - Fri: 9 AM - 6 PM</p>
              <p>Sat: 10 AM - 4 PM</p>
              <p>Sun: Closed</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
