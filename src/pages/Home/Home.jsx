import React from 'react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
        <div className="gradient-blob-1"></div>
        <div className="gradient-blob-2"></div>
        <div className="gradient-blob-3"></div>
        <p className="hero-p">For Research Driven Students</p>
        <h1 className="hero-h1">Discover the Best Professors Quickly</h1>
        <div className="about-section">
            <h2 className="about-h2">Key Features</h2>
            <div className="features-section">
                <div className="feature-div">
                    <div className="feature-header">
                        <span className="feature-span"><i class="fa-solid fa-caret-right"></i></span>
                        <h3 className="feature-h3">Professor Search</h3>
                    </div>
                    <p className="feature-p">Find professors around the world and filter by their College, Department, or Research Interests.</p>
                </div>
                <div className="feature-div">
                    <div className="feature-header">
                        <span className="feature-span"><i class="fa-solid fa-caret-right"></i></span>
                        <h3 className="feature-h3">Personalized Dashboard</h3>
                    </div>
                    <p className="feature-p">Access a user-specific dashboard to save professor profiles, organize research files, and track your progress.</p>
                </div>
                <div className="feature-div">
                    <div className="feature-header">
                        <span className="feature-span"><i class="fa-solid fa-caret-right"></i></span>
                        <h3 className="feature-h3">Paper Summarizations</h3>
                    </div>
                    <p className="feature-p">Get summaries of professors' recent papers to understand their research and write cold emails more effectively.</p>
                </div>
            </div>
        </div>
    </div>
  );
}
