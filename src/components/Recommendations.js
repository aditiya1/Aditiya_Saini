import React from 'react';
import { motion } from 'framer-motion';
import './Recommendations.css';

const Recommendations = () => {
  const recommendations = [
    {
      name: 'Sounthararajan Sriharshan',
      title: 'MIT | Web Designer & Developer',
      date: 'February 9, 2026',
      relation: 'Managed Aditiya directly',
      quote: "I had the pleasure of working closely with Aditiya Saini as part of my team, and I can confidently say he has been a valuable asset. Aditiya is highly efficient, focused, and consistently demonstrates a strong commitment to delivering quality work.\n\nHe has contributed to multiple projects across WordPress, PHP development, AI integrations, and backend systems, including database management. His technical versatility allows him to quickly understand requirements and translate them into practical, reliable solutions. He has proven his knowledge across many areas and is always willing to learn and adapt when faced with new challenges.\n\nBeyond his technical skills, Aditiya is a great team player. He collaborates well with others, communicates clearly, and maintains a positive attitude even under pressure. His reliability and dedication make him someone you can trust with responsibility, and his work ethic sets a strong example for the team.\n\nI would highly recommend Aditiya to any organization looking for a skilled and dependable developer who brings both technical capability and teamwork to the table."
    },
    {
      name: 'Lukas Himsel',
      title: 'Founder, CTO, Flutter & Full Stack Developer, GDG Meetup Organizer',
      date: 'September 3, 2023',
      relation: 'Managed Aditiya directly',
      quote: "As CTO of the industry partner Earlybuild, I had the pleasure of working with Aditiya on a project at RMIT where we aimed to develop a state-of-the-art cloud platform for site due diligence for real estate developers.\n\nOur project involved a lot of data engineering, specifically the scraping and preparation of geospatial and demographic data for site evaluation.\n\nAditiya took on significant responsibility, particularly in containerising our microservices (using Docker) and managing their runtime on Google Cloud Run. His ability to write clear documentation also contributed greatly to the clarity and success of the project."
    }
  ];

  return (
    <section id="recommendations" className="recommendations-section">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          Recommendations
        </motion.h2>

        <div className="recommendations-grid">
          {recommendations.map((rec, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="recommendation-card"
            >
              <div className="recommendation-author">
                <div className="recommendation-author-info">
                  <span className="recommendation-name">{rec.name}</span>
                  <span className="recommendation-title">{rec.title}</span>
                  <span className="recommendation-meta">
                    {rec.date} · {rec.relation}
                  </span>
                </div>
              </div>
              <p className="recommendation-quote">{rec.quote}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recommendations;
