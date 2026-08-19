import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const IconLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3 3.5 8 12 13l8.5-5L12 3Z" />
    <path d="M3.5 12 12 17l8.5-5" />
    <path d="M3.5 16 12 21l8.5-5" />
  </svg>
);

const IconNeural = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="6" cy="6" r="2.2" />
    <circle cx="18" cy="6" r="2.2" />
    <circle cx="12" cy="12" r="2.4" />
    <circle cx="6" cy="18" r="2.2" />
    <circle cx="18" cy="18" r="2.2" />
    <path d="M8 7.2 10.2 10.4M16 7.2 13.8 10.4M10.2 13.6 8 16.8M13.8 13.6 16 16.8" />
  </svg>
);

const IconGauge = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.8 16.2A8.2 8.2 0 1 1 19.2 16.2" />
    <path d="M12 13.2 15.6 8.8" />
    <path d="M12 17.5v.2" />
  </svg>
);

const IconPenTool = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3.5 8.2 14.2 12 16.5l3.8-2.3L12 3.5Z" />
    <path d="M8.2 14.2 5.5 20.5 12 16.5 18.5 20.5 15.8 14.2" />
    <circle cx="12" cy="9.2" r="1.1" />
  </svg>
);

const highlights = [
  {
    title: 'Full Stack Development',
    description: 'End-to-end web applications with React, PHP, and ASP .NET.',
    Icon: IconLayers,
  },
  {
    title: 'AI Integration',
    description: 'RAG chat pipelines, vector search, and OpenAI-powered tools.',
    Icon: IconNeural,
  },
  {
    title: 'Performance & Cloud',
    description: 'Docker, GCP, and AWS — faster deploys, stable systems.',
    Icon: IconGauge,
  },
  {
    title: 'Product UI',
    description: 'Clear interfaces that stay usable under real workflows.',
    Icon: IconPenTool,
  },
];

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="about" className="about-section">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          About Me
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="about-content"
        >
          <motion.div variants={itemVariants} className="about-text">
            <p className="about-intro">
              I'm a passionate <strong>Full Stack Developer</strong> with expertise in building
              modern web applications and AI-powered solutions. Currently working as a Junior
              Full Stack Developer at Global Travel Xperts, where I develop and enhance internal
              web applications using cutting-edge technologies.
            </p>
            <p>
              My journey in technology started with a Bachelor's in Electronics Engineering,
              which gave me a strong foundation in programming and system design. I then pursued
              a Master's in Information Technology at RMIT University, where I honed my skills
              in software and web development through hands-on projects and real-world collaborations.
            </p>
            <p>
              I'm particularly passionate about <strong>AI-powered solutions</strong>, having built
              complete chatbot pipelines with semantic chunking, vector databases, and retrieval-augmented
              generation. I love creating interactive analytics dashboards and optimizing system
              performance to deliver exceptional user experiences.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="about-highlights">
            {highlights.map(({ title, description, Icon }) => (
              <article key={title} className="highlight-card">
                <div className="highlight-icon">
                  <Icon />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
