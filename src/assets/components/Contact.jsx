import React, { useState } from "react";

const Contact = ({ onSubmit }) => {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    service: "", subject: "", message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
    setForm({ firstName: "", lastName: "", email: "", phone: "", service: "", subject: "", message: "" });
  };

  return (
    <section className="section" id="contact" aria-label="Contact Us">
      <div className="section-header">
        <span className="section-eyebrow">Get In Touch</span>
        <h2 className="section-title">Contact Us</h2>
        <p className="section-desc">
          Have questions or need assistance? Our team is here to help you 24/7.
        </p>
      </div>

      <div className="contact-container">
        {/* Contact Info */}
        <div className="contact-info">
          <h3>We're Here for You</h3>
          <p>
            Whether you need help booking an appointment, have questions about our services,
            or need to reach our medical team — we're just a message away.
          </p>

          <div className="contact-methods" role="list" aria-label="Contact methods">
            <div className="contact-method" role="listitem">
              <div className="method-icon" aria-hidden="true"><i className="fas fa-phone-alt"></i></div>
              <div className="method-text">
                <span>Phone</span>
                <strong>+1 (800) 555-CARE</strong>
              </div>
            </div>
            <div className="contact-method" role="listitem">
              <div className="method-icon" aria-hidden="true"><i className="fas fa-envelope"></i></div>
              <div className="method-text">
                <span>Email</span>
                <strong>support@cliniccare.com</strong>
              </div>
            </div>
            <div className="contact-method" role="listitem">
              <div className="method-icon" aria-hidden="true"><i className="fas fa-map-marker-alt"></i></div>
              <div className="method-text">
                <span>Address</span>
                <strong>123 Health Ave, Medical District, NY 10001</strong>
              </div>
            </div>
            <div className="contact-method" role="listitem">
              <div className="method-icon" aria-hidden="true"><i className="fas fa-clock"></i></div>
              <div className="method-text">
                <span>Working Hours</span>
                <strong>Mon–Sun: 7:00 AM – 10:00 PM</strong>
              </div>
            </div>
          </div>

          {/* Hotline Box */}
          <div className="hotline-box" role="complementary" aria-label="Emergency Hotline">
            <div className="hicon" aria-hidden="true">🚨</div>
            <div>
              <h4>24/7 Emergency Hotline</h4>
              <p>+1 (800) 911-CARE</p>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="map-placeholder" aria-label="Location map">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=-74.0200%2C40.7050%2C-73.9700%2C40.7250&layer=mapnik"
              title="ClinicCare Location Map"
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form" role="region" aria-label="Contact form">
          <h3 className="form-title">
            <i className="fas fa-paper-plane" aria-hidden="true" style={{ color: "var(--teal)", marginRight: "0.5rem" }}></i>
            Send Us a Message
          </h3>
          <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input id="firstName" name="firstName" type="text" placeholder="John" value={form.firstName} onChange={handleChange} required aria-required="true" />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" name="lastName" type="text" placeholder="Doe" value={form.lastName} onChange={handleChange} required aria-required="true" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input id="email" name="email" type="email" placeholder="john@email.com" value={form.email} onChange={handleChange} required aria-required="true" />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="service">Service of Interest</label>
              <select id="service" name="service" value={form.service} onChange={handleChange} aria-label="Select service">
                <option value="">Select a Service</option>
                <option>General Consultation</option>
                <option>Pediatrics</option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Diagnostics</option>
                <option>Emergency Care</option>
                <option>Dermatology</option>
                <option>Orthopedics</option>
                <option>Mental Health</option>
                <option>Ophthalmology</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input id="subject" name="subject" type="text" placeholder="How can we help?" value={form.subject} onChange={handleChange} required aria-required="true" />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={4} placeholder="Describe your inquiry or health concern..." value={form.message} onChange={handleChange} required aria-required="true"></textarea>
            </div>

            <button type="submit" className="btn-send" aria-label="Send message">
              <i className="fas fa-paper-plane" aria-hidden="true"></i>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;