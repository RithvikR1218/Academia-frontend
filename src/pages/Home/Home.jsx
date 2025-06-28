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
            <p className="about-p">About Us</p>
            <h2 className="about-h2">Key Features</h2>
            <div className="features-section">
                <div className="feature-div">
                    <div className="feature-header">
                        <span className="feature-span"><i class="fa-solid fa-caret-right"></i></span>
                        <h3 className="feature-h3">First Thing</h3>
                    </div>
                    <p className="feature-p">Lorem ipsum dolor sit, consectetur neque porro quisquam est</p>
                </div>
                <div className="feature-div">
                    <div className="feature-header">
                        <span className="feature-span"><i class="fa-solid fa-caret-right"></i></span>
                        <h3 className="feature-h3">Second Thing</h3>
                    </div>
                    <p className="feature-p">Lorem ipsum dolor sit, consectetur neque porro quisquam est</p>
                </div>
                <div className="feature-div">
                    <div className="feature-header">
                        <span className="feature-span"><i class="fa-solid fa-caret-right"></i></span>
                        <h3 className="feature-h3">Third Thing</h3>
                    </div>
                    <p className="feature-p">Lorem ipsum dolor sit, consectetur neque porro quisquam est</p>
                </div>
            </div>
        </div>
    </div>
  );
}
