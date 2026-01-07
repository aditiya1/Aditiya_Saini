import React from 'react';
import { motion } from 'framer-motion';
import './Certifications.css';

const Certifications = () => {
  const certifications = [
    {
      name: 'Agile Methodology Job Simulation',
      issuer: 'Cognizant',
      date: 'Nov 2023',
      icon: '🎯'
    },
    {
      name: 'Introduction to Front-End Development',
      issuer: 'Coursera (Meta)',
      date: 'Jan 2024',
      icon: '💻'
    },
    {
      name: 'Programming with JavaScript',
      issuer: 'Coursera (Meta)',
      date: 'Feb 2024',
      icon: '⚡'
    },
    {
      name: 'HTML and CSS in depth',
      issuer: 'Coursera (Meta)',
      date: 'Apr 2024',
      icon: '🎨'
    },
    {
      name: 'Generative AI',
      issuer: 'Codecademy',
      date: 'Mar 2025 – Current',
      icon: '🤖',
      current: true
    },
    {
      name: 'Full-Stack Engineer',
      issuer: 'Codecademy',
      date: 'Jan 2025 – Current',
      icon: '🚀',
      current: true
    }
  ];

  return (
    <section id="certifications" className="certifications-section">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          Certifications
        </motion.h2>

        <div className="certifications-grid">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`certification-card ${cert.current ? 'current' : ''}`}
            >
              <div className="cert-icon">{cert.icon}</div>
              <div className="cert-content">
                <h3 className="cert-name">{cert.name}</h3>
                <p className="cert-issuer">{cert.issuer}</p>
                <span className="cert-date">
                  {cert.date}
                  {cert.current && <span className="current-badge">In Progress</span>}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;


