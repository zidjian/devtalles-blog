'use client';
import LiquidEther from '@/components/LiquidEther';
import { HeroSection } from './components/HeroSection';
import Navbar from './components/Navbar';
import { ContentSection } from './components/ContentSection';
import FeaturesContent from './components/FeaturesContent';
import BlogPreview from './components/BlogPreview';
import FooterSection from './components/Footer';

export default function Landing() {
    return (
        <>
            {/* Fondo LiquidEther - Fijo y cubriendo toda la página */}
            <div className="fixed inset-0 z-0 w-full h-full bg-black">
                <LiquidEther
                    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                    mouseForce={20}
                    cursorSize={100}
                    isViscous={false}
                    viscous={30}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={false}
                    autoDemo={true}
                    autoSpeed={1.5}
                    autoIntensity={4}
                    takeoverDuration={0.25}
                    autoResumeDelay={1000}
                    autoRampDuration={0.6}
                />
            </div>

            {/* Navbar - Fijo en la parte superior */}
            <Navbar />

            {/* Contenido principal - Con scroll normal */}
            <div className="relative z-10 min-h-screen pointer-events-none">
                {/* HeroSection */}
                <div id="hero" className="pointer-events-auto">
                    <HeroSection />
                </div>
                {/* Autor Section */}
                <div id="autor" className="pointer-events-auto">
                    <ContentSection />
                </div>
                {/* Features Content */}
                <div id="features" className="pointer-events-auto">
                    <FeaturesContent />
                </div>
                {/* Blog Preview */}
                <div id="blog-preview" className="pointer-events-auto">
                    <BlogPreview />
                </div>
                {/* Footer */}
                <div id="footer" className="pointer-events-auto">
                    <FooterSection />
                </div>
            </div>
        </>
    );
}
