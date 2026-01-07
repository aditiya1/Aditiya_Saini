import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
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
            <div className="highlight-card">
              <div className="highlight-icon">🚀</div>
              <h3>Full Stack Development</h3>
              <p>Building end-to-end web applications with modern frameworks</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">🤖</div>
              <h3>AI Integration</h3>
              <p>Creating intelligent solutions with OpenAI and custom AI systems</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">⚡</div>
              <h3>Performance Optimization</h3>
              <p>Optimizing applications for speed and scalability</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">🎨</div>
              <h3>UI/UX Design</h3>
              <p>Designing beautiful and intuitive user interfaces</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;


