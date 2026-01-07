import React from 'react';
import { motion } from 'framer-motion';
import './Experience.css';

const Experience = () => {
  const experiences = [
    {
      title: 'Junior Full Stack Developer',
      company: 'Global Travel Xperts',
      period: 'Jun 2025 – Current',
      location: '',
      achievements: [
        'Developed and enhanced internal web applications using HTML, CSS, JavaScript, React, PHP, WordPress',
        'Built AI-powered solutions using OpenAI, Cursor, Docker, including data analysis tools and call-analysis automation',
        'Designed and implemented a complete AI chatbot pipeline with semantic chunking, vector generation, and retrieval-augmented response generation',
        'Created interactive analytics dashboards for operational teams, enabling real-time insights into sales, performance metrics, and call trends',
        'Collaborated in an Agile environment, participating in sprints, stand-ups, and code reviews',
        'Debugged and optimized front- and back-end components to reduce errors and enhance platform stability'
      ]
    },
    {
      title: 'Junior Web Developer',
      company: 'AK Smart Solution',
      period: 'Sep 2024 – May 2025',
      location: '',
      achievements: [
        'Contributed to the design and development of internal web applications using HTML, CSS, PHP, React, and WordPress',
        'Collaborated in an Agile development environment, participating in sprint planning, daily stand-ups, and code reviews',
        'Assisted in debugging and optimizing both front-end and back-end components, contributing to a 30% reduction in system downtime',
        'Helped implement responsive design practices, ensuring seamless performance across devices and browsers',
        'Supported API integration and enhancement of cloud-based services to boost application scalability and reliability'
      ]
    },
    {
      title: 'Software Developer (Internship)',
      company: 'Early Build',
      period: 'Feb 2023 – Jun 2023',
      location: 'Melbourne, Australia',
      achievements: [
        'Engineered a backend system that processed geospatial and demographic data, improving data preparation efficiency',
        'Developed interactive visualizations that speed up site analysis by 30%',
        'Optimized website performance, reducing page load time by 25% across mobile and desktop',
        'Containerized microservices with Docker, increasing deployment efficiency by 40% on Google Cloud Run',
        'Maintained high code quality removing bugs and used Git for version control, reducing the development cycle by 20%',
        'Met 100% of project goals and stakeholder expectations, demonstrating effective problem solving and project management'
      ]
    }
  ];

  return (
    <section id="experience" className="experience-section">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          Experience
        </motion.h2>

        <div className="timeline">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="timeline-item"
            >
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3 className="timeline-title">{exp.title}</h3>
                  <span className="timeline-period">{exp.period}</span>
                </div>
                <div className="timeline-company">
                  <h4>{exp.company}</h4>
                  {exp.location && <span className="timeline-location">{exp.location}</span>}
                </div>
                <ul className="timeline-achievements">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
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

export default Experience;


