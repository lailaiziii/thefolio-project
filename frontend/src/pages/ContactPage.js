import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ message: '', color: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    // Validation Logic
    if (name.trim().length < 3) {
      setStatus({ message: "Name must be at least 3 characters long.", color: "red" });
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setStatus({ message: "Please enter a valid email address.", color: "red" });
      return;
    }

    if (message.trim().length < 8) {
      setStatus({ message: "Message must be at least 8 characters long.", color: "red" });
      return;
    }

    // Success
    setStatus({ message: "Message sent successfully! ✔", color: "green" });
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-wrapper-custom">
      {/* The <header> and <nav> are now removed because 
          they are handled globally by App.js and Navbar.js 
      */}

      <section className="content">
        <h2>Contact Me</h2>
        <form id="contactForm" onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input 
            type="text" 
            id="name" 
            placeholder="Your Name" 
            value={formData.name}
            onChange={handleInputChange}
            required 
          />

          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            placeholder="example@email.com" 
            value={formData.email}
            onChange={handleInputChange}
            required 
          />

          <label htmlFor="message">Message:</label>
          <textarea 
            id="message" 
            placeholder="Enter at least 8 characters" 
            value={formData.message}
            onChange={handleInputChange}
            required 
          />

          <button type="submit">Send Message</button>

          {status.message && (
            <p id="errorMsg" style={{ color: status.color, marginTop: '10px' }}>
              {status.message}
            </p>
          )}
        </form>
      </section>

      <section className="content">
        <h2>Helpful Resources</h2>
        <table style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
          <thead>
            <tr>
              <th>Resource Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Adobe Photoshop</td>
              <td>Professional digital art software</td>
            </tr>
            <tr>
              <td>Procreate</td>
              <td>Popular illustration app for tablets</td>
            </tr>
            <tr>
              <td>ArtStation</td>
              <td>Portfolio platform for artists</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="content">
        <h2>Location</h2>
        <div className="location-images">
          <img src="/assets/loc1.png" alt="Map location 1" />
          <img src="/assets/loc2.png" alt="Map location 2" />
        </div>
      </section>

      <footer>
        <p>External Links: {' '}
          <a href="https://www.artstation.com" target="_blank" rel="noreferrer">ArtStation</a> | {' '}
          <a href="https://www.behance.net" target="_blank" rel="noreferrer">Behance</a>
        </p>
        <p>© 2026 Illustrated Mind | Images from Unsplash & Pexels</p>
      </footer>
    </div>
  );
};

export default ContactPage;