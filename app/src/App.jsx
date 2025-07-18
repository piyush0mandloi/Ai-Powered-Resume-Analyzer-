import React, { useState } from 'react';
import { Upload, CheckCircle, FileText, Sparkles, Target, TrendingUp, Clock } from 'lucide-react';

function App() {
  const [resume, setResume] = useState(null);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleOnSubmit = async () => {
    setIsLoading(true);

    if (!resume) {
      alert('Please upload a PDF file.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      const response = await fetch('${process.env.REACT_APP_BACKEND_URL}/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Something went wrong with upload!');
      }

      const data = await response.json();
      setScore(data.score);
      setFeedback(data.feedback);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload resume. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setResume(file);
      } else {
        alert('Please upload a PDF file.');
      }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-600';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className="w-6 h-6 text-emerald-500" />;
    if (score >= 60) return <Clock className="w-6 h-6 text-yellow-500" />;
    return <Target className="w-6 h-6 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              ATS Checker
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Transform your resume with AI-powered ATS analysis. Get instant feedback and boost your job application success rate.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Column - How it Works */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">How it Works</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Upload Resume</h3>
                    <p className="text-gray-300 text-sm">Drop your PDF resume or click to browse</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">AI Analysis</h3>
                    <p className="text-gray-300 text-sm">Our advanced AI analyzes your resume</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Get Results</h3>
                    <p className="text-gray-300 text-sm">Receive score and improvement tips</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Upload Form */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="space-y-6">
                <div className="text-center">
                  <FileText className="w-12 h-8 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Upload Your Resume</h3>
                  <p className="text-gray-300 text-sm">PDF format only</p>
                </div>

                <div
                  className={`relative border-2 border-dashed rounded-2xl p-2 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-purple-400 bg-purple-400/10' 
                      : 'border-gray-400 hover:border-purple-400 hover:bg-white/5'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    name="resume"
                    id="resume"
                    accept=".pdf"
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    required
                    onChange={(e) => setResume(e.target.files[0])}
                  />
                  
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                      <Upload className="w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {resume ? resume.name : 'Drop your PDF here or click to browse'}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">Maximum file size: 10MB</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleOnSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing Resume...
                    </div>
                  ) : (
                    'Analyze Resume'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {score !== null && (
          <div className="mt-12 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  {getScoreIcon(score)}
                  <h2 className="text-3xl font-bold text-white">Your ATS Score</h2>
                </div>
                
                {/* Score Display */}
                <div className="relative inline-block">
                  <div className="w-32 h-32 mx-auto mb-6">
                    <div className="relative w-full h-full">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-white/20"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="url(#scoreGradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${score * 2.51} 251`}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" className={`stop-color: ${score >= 80 ? 'rgb(16, 185, 129)' : score >= 60 ? 'rgb(245, 158, 11)' : 'rgb(239, 68, 68)'}`} />
                            <stop offset="100%" className={`stop-color: ${score >= 80 ? 'rgb(5, 150, 105)' : score >= 60 ? 'rgb(217, 119, 6)' : 'rgb(220, 38, 127)'}`} />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">{score}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Description */}
                <div className="mb-8">
                  <p className={`text-lg font-semibold ${
                    score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {score >= 80 ? 'Excellent! Your resume is ATS-friendly' : 
                     score >= 60 ? 'Good! Some improvements needed' : 
                     'Needs improvement for better ATS compatibility'}
                  </p>
                </div>
              </div>

              {/* Feedback Section */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Detailed Feedback
                </h3>
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {feedback}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <button
                  onClick={() => {
                    setScore(null);
                    setFeedback('');
                    setResume(null);
                  }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all duration-300 hover:scale-105"
                >
                  Analyze Another Resume
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Save Results
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;