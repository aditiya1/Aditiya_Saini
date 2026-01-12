import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import './Projects.css';

const Projects = () => {
  return (
    <section id="projects" className="projects-section">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          Featured Projects
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="projects-intro"
        >
          Explore my latest projects showcasing innovative solutions and cutting-edge technologies.
        </motion.p>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="project-card"
            >
              <div className="project-image-wrapper">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="project-image" />
                ) : (
                  <div className="project-image-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                  </div>
                )}
                <div className="project-overlay">
                  <Link to={`/project/${project.id}`} className="project-link-btn">
                    View Details
                  </Link>
                </div>
              </div>
              <div className="project-content">
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-description">{project.shortDescription}</p>
                <div className="project-tags">
                  {project.technologies.slice(0, 4).map((tech, idx) => (
                    <span key={idx} className="project-tag">{tech}</span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="project-tag project-tag-more">+{project.technologies.length - 4} more</span>
                  )}
                </div>
                <div className="project-card-actions">
                  <Link to={`/project/${project.id}`} className="project-card-link">
                    Learn More →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* More Projects Coming Soon Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: projects.length * 0.1 }}
            className="project-card coming-soon-card"
          >
            <div className="project-image-wrapper coming-soon-image">
              <div className="project-image-placeholder coming-soon-placeholder">
                <motion.svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </motion.svg>
              </div>
            </div>
            <div className="project-content coming-soon-content">
              <h3 className="project-card-title coming-soon-title">More Projects Coming Soon</h3>
              <p className="project-card-description coming-soon-description">
                I'm constantly working on new projects and exciting innovations. Stay tuned for more amazing solutions coming your way!
              </p>
              <div className="coming-soon-icon">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Projects;

