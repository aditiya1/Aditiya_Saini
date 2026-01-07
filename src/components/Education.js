import React from 'react';
import { motion } from 'framer-motion';
import './Education.css';

const Education = () => {
  const education = [
    {
      degree: 'Master of Information Technology',
      institution: 'Royal Melbourne Institute of Technology (RMIT) University',
      period: 'Mar 2021 – Dec 2023',
      description: [
        'Developed expertise in software and web development through hands-on projects and coursework',
        'Completed industry-focused projects, collaborating with a company on a real-time project to build a cloud platform for real estate site evaluation'
      ]
    },
    {
      degree: 'Bachelor of Electronics Engineering',
      institution: 'UPES, India',
      period: 'Jul 2015 – Dec 2019',
      description: [
        'Built a strong foundation in programming, data structures, and networking through hands-on projects',
        'Developed IoT-based applications, integrating software development with cloud technologies'
      ]
    }
  ];

  return (
    <section id="education" className="education-section">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          Education
        </motion.h2>

        <div className="education-grid">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="education-card"
            >
              <div className="education-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path d="M12 14v7" />
                </svg>
              </div>
              <div className="education-content">
                <h3 className="education-degree">{edu.degree}</h3>
                <h4 className="education-institution">{edu.institution}</h4>
                <span className="education-period">{edu.period}</span>
                <ul className="education-description">
                  {edu.description.map((desc, idx) => (
                    <li key={idx}>{desc}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;


