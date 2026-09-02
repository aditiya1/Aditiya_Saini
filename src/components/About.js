import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const facts = [
  { label: 'Now', value: 'Junior Full Stack Developer, Global Travel Xperts' },
  { label: 'Focus', value: 'Web apps, RAG pipelines, operational dashboards' },
  { label: 'School', value: 'MIT, RMIT University · B.Eng. Electronics' },
];

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-title"
        >
          About
        </motion.h2>

        <div className="about-content">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <p className="about-intro">
              I work as a full stack developer at Global Travel Xperts, building
              internal web applications and AI tools the operations team actually uses.
            </p>
            <p>
              I started in electronics engineering, then completed a Master’s in
              Information Technology at RMIT. That path shows up in how I work:
              systems first, then the interface.
            </p>
            <p>
              I have shipped chatbot pipelines with semantic chunking, vector search,
              and retrieval-augmented answers — the same pattern running in the
              assistant on this site.
            </p>
          </motion.div>

          <motion.dl
            className="about-facts"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {facts.map(({ label, value }) => (
              <div className="about-fact" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
};

export default About;
