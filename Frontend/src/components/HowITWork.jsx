import React, { useState, useEffect } from 'react';
import { 
  ClipboardEdit, 
  Wand2, 
  Video, 
  FileCheck, 
  BarChart3, 
  PlayCircle,
  Award
} from 'lucide-react';

/*
 * FadeIn Component
 * A simple wrapper component to fade in its children on mount.
 */
const FadeIn = ({ children, delay = 0 }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50); // Small delay to ensure transition runs
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`transition-all duration-1000 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/*
 * Step Card Component
 * Renders a single step in the "How it Works" process.
 */
const StepCard = ({ icon: Icon, title, description, isLast = false }) => {
  return (
    <div className="relative flex gap-6">
      {/* The connecting line (dashed) */}
      {!isLast && (
        <div className="absolute left-6 top-14 -bottom-4 w-px border-l-2 border-dashed border-gray-700" />
      )}
      
      {/* The icon and its circle */}
      <div className="relative z-10 flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 border-2 border-sky-500 text-sky-400">
          <Icon size={24} />
        </div>
      </div>
      
      {/* The step's text content */}
      <div className="pb-10">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  );
};

/*
 * Main HowItWorks Component
 * This is the main page component.
 */
function HowItWorks() {

  const steps = [
    {
      icon: ClipboardEdit,
      title: 'Step 1: Provide Your Details',
      description: 'Start by telling us the job position, sharing the job description, and letting us know your experience level.'
    },
    {
      icon: Wand2,
      title: 'Step 2: AI Generates Questions',
      description: 'Our advanced AI analyzes your details and instantly creates 5 custom interview questions, just like a real hiring manager.'
    },
    {
      icon: Video,
      title: 'Step 3: Record Your Answers',
      description: 'Take the interview anytime, anywhere. Simply record your answers to the questions using your device\'s camera.'
    },
    {
      icon: FileCheck,
      title: 'Step 4: AI Evaluates Your Performance',
      description: 'Our smart technology analyzes your video, evaluating not just what you said, but your communication, confidence, and clarity.'
    },
    {
      icon: BarChart3,
      title: 'Step 5: Receive Your Detailed Report',
      description: 'Get an instant, in-depth report with scores, a performance rating, and actionable feedback on how to improve.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter p-6 md:p-12">
      <div className="container mx-auto max-w-4xl">
        
        {/* Header Section */}
        <FadeIn delay={0}>
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              How It <span className="text-sky-400">Works</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              A simple, step-by-step guide to mastering your interviews with the power of AI.
            </p>
          </header>
        </FadeIn>

        {/* "See It in Action" Video Placeholder */}
        <FadeIn delay={200}>
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              See It in Action
            </h2>
            <div className="aspect-video bg-gray-800 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
              {/* This is a placeholder, you can replace it with an iframe or video tag */}
              <div className="text-center text-gray-500">
                <PlayCircle size={80} className="mx-auto opacity-50" />
                <p className="mt-4 font-semibold">Watch a 2-minute demo</p>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Step-by-Step Process Section */}
        <section className="mb-20">
          {steps.map((step, index) => (
            <FadeIn key={index} delay={400 + index * 200}>
              <StepCard
                icon={step.icon}
                title={step.title}
                description={step.description}
                isLast={index === steps.length - 1}
              />
            </FadeIn>
          ))}
        </section>

        {/* Premium Customer CTA */}
        <FadeIn delay={1200}>
          <section className="bg-gradient-to-r from-gray-800 to-gray-800/80 rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-sky-500/10 text-sky-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Master Your Interviews?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Our Premium customers get access to <span className="text-white font-bold">100 AI interviews</span>, allowing you to practice for any role, anytime.
            </p>
            <button className="bg-sky-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:bg-sky-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-sky-500/50">
              Go Premium Now
            </button>
          </section>
        </FadeIn>
        
      </div>
    </div>
  );
}

// Export the component as default
export default HowItWorks;