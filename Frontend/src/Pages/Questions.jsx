import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, 
  HeartPulse, 
  DollarSign, 
  Megaphone, 
  Briefcase, 
  Lightbulb,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

// --- Mock Data for Showcase ---
// This data demonstrates the AI's capability across various sectors.
const sectorData = {
  tech: {
    title: "Technology",
    icon: Code,
    examples: [
      {
        position: "Senior React Developer",
        experience: "5+ Years",
        questions: [
          "Given a large-scale React application, how would you approach optimizing its performance, specifically addressing re-renders?",
          "Describe your experience with state management in React. When would you choose Context API over Redux (or vice-versa)?",
          "Explain the trade-offs of using server-side rendering (SSR) vs. static site generation (SSG) in a Next.js project.",
        ]
      },
      {
        position: "DevOps Engineer",
        experience: "3 Years",
        questions: [
          "How would you design a highly available and scalable CI/CD pipeline for a microservices architecture on AWS?",
          "Describe a time you had to troubleshoot a production outage. What was your process?",
          "What are the key differences between containerization (Docker) and orchestration (Kubernetes)?",
        ]
      },
    ]
  },
  healthcare: {
    title: "Healthcare",
    icon: HeartPulse,
    examples: [
      {
        position: "Registered Nurse (ICU)",
        experience: "3-5 Years",
        questions: [
          "Describe a time you had to manage a rapidly deteriorating patient. What steps did you take and what was the outcome?",
          "How do you handle disagreements with a physician about a patient's care plan while maintaining a professional relationship?",
          "What is your experience with ventilatory support and hemodynamic monitoring for critically ill patients?",
        ]
      }
    ]
  },
  finance: {
    title: "Finance",
    icon: DollarSign,
    examples: [
      {
        position: "Financial Analyst",
        experience: "2 Years",
        questions: [
          "Walk me through how you would build a 3-statement financial model for a company.",
          "What are the most common valuation methods, and when would you use each one?",
          "How do you assess the creditworthiness of a company?",
        ]
      }
    ]
  },
  marketing: {
    title: "Marketing",
    icon: Megaphone,
    examples: [
      {
        position: "Digital Marketing Manager",
        experience: "4+ Years",
        questions: [
          "You are given a $50,000 budget to launch a new B2B SaaS product. How would you allocate that budget across different channels?",
          "What are your key metrics for measuring the success of an email marketing campaign?",
          "How have you used SEO and content marketing to drive organic growth in a previous role?",
        ]
      }
    ]
  },
  hr: {
    title: "Human Resources",
    icon: Briefcase,
    examples: [
      {
        position: "HR Business Partner",
        experience: "5 Years",
        questions: [
          "Describe a complex employee relations issue you managed. What was the situation, your approach, and the resolution?",
          "How do you partner with business leaders to develop and implement a talent retention strategy?",
          "What data would you use to measure the effectiveness of your DE&I (Diversity, Equity, and Inclusion) initiatives?",
        ]
      }
    ]
  },
};

// Array for mapping the tabs
const sectors = [
  { id: 'tech', title: 'Technology', icon: Code },
  { id: 'healthcare', title: 'Healthcare', icon: HeartPulse },
  { id: 'finance', title: 'Finance', icon: DollarSign },
  { id: 'marketing', title: 'Marketing', icon: Megaphone },
  { id: 'hr', title: 'Human Resources', icon: Briefcase },
];

export default function Question() {
  const [activeSector, setActiveSector] = useState('tech');
  const [isVisible, setIsVisible] = useState(true);

  const currentData = sectorData[activeSector];

  const handleSectorClick = (sectorId) => {
    if (sectorId === activeSector) return;

    setIsVisible(false); // Start fade-out
    setTimeout(() => {
      setActiveSector(sectorId);
      setIsVisible(true); // Start fade-in with new content
    }, 300); // Match this duration with the transition
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0f] via-[#111113] to-[#1b1b1d] text-white font-inter p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent mb-4">
            Questions for Every Industry
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Our AI thinks like a seasoned hiring manager, generating tailored questions based on{" "}
            <span className="font-semibold text-sky-400">Job Position</span>,{" "}
            <span className="font-semibold text-sky-400">Job Description</span>, and{" "}
            <span className="font-semibold text-sky-400">Experience</span>.
          </p>
        </div>

        {/* --- Sector Tabs --- */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10">
          {sectors.map((sector) => (
            <button
              key={sector.id}
              onClick={() => handleSectorClick(sector.id)}
              className={`flex items-center gap-2 py-3 px-5 rounded-full font-semibold transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
                activeSector === sector.id
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <sector.icon size={18} />
              <span>{sector.title}</span>
            </button>
          ))}
        </div>

        {/* --- Dynamic Content Area --- */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          {currentData && (
            <div className="space-y-8">
              {currentData.examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-6 md:p-8"
                >
                  {/* Example Role Details */}
                  <div className="flex flex-col md:flex-row md:items-center md:gap-6 border-b border-white/10 pb-4 mb-4">
                    <h2 className="text-2xl font-bold text-white mb-2 md:mb-0">
                      {example.position}
                    </h2>
                    <span className="bg-sky-500/20 text-sky-300 text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap">
                      {example.experience} Experience
                    </span>
                  </div>

                  {/* Example Questions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                      <Lightbulb size={20} className="text-sky-400" />
                      Sample AI-Generated Questions:
                    </h3>
                    <ul className="space-y-3 pl-2">
                      {example.questions.map((q, qIndex) => (
                        <li key={qIndex} className="flex items-start gap-3">
                          <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                          <p className="text-gray-300">{q}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- Call to Action --- */}
        <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
                Ready to face your personalized interview?
            </h2>
            <Link to="/yourDetails">
                <button
                className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold py-4 px-10
                rounded-full text-lg shadow-lg hover:shadow-sky-500/40 transition-all duration-300
                transform hover:scale-105 flex items-center gap-3 mx-auto"
                >
                Start Your First Interview
                <ArrowRight size={22} />
                </button>
            </Link>
        </div>

      </div>
    </div>
  );
}