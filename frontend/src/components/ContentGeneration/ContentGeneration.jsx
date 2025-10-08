import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MobileSafeBackground from "../shared/MobileSafeBackground";

const BlogPostAIAssistant = () => {
  const [formData, setFormData] = useState({
    prompt: "",
    tone: "",
    category: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [error, setError] = useState("");
  

  const [credits, setCredits] = useState(() => {
    try {
      const saved = localStorage.getItem('userCredits');
      return saved ? JSON.parse(saved) : { total: 5, used: 0 };
    } catch {
      return { total: 5, used: 0 };
    }
  });


  useEffect(() => {
    try {
      localStorage.setItem('userCredits', JSON.stringify(credits));
    } catch (e) {
      console.warn('Could not save credits to localStorage');
    }
  }, [credits]);


  const generateBlogContent = (topic, tone, category) => {
    const toneStyles = {
      formal: {
        intro: "In the contemporary landscape of",
        analysis: "A comprehensive examination reveals",
        conclusion: "In conclusion, it is evident that"
      },
      informal: {
        intro: "Let's dive into",
        analysis: "Here's what's really interesting:",
        conclusion: "So, what's the bottom line?"
      },
      humorous: {
        intro: "Buckle up, because we're about to explore",
        analysis: "Now, here's where things get interesting (and slightly ridiculous):",
        conclusion: "And there you have it, folks!"
      }
    };

    const style = toneStyles[tone] || toneStyles.formal;
    const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
    
    return `# ${capitalizedTopic}: A ${tone.charAt(0).toUpperCase() + tone.slice(1)} Guide

## Introduction

${style.intro} ${category}, ${topic} has emerged as a pivotal element that demands our attention. This ${tone} exploration will uncover the essential aspects and provide valuable insights.

## Key Insights

• **Understanding ${capitalizedTopic}**: Core principles and fundamentals
• **Current Trends**: What's happening in ${category} right now
• **Impact Analysis**: How ${topic} is reshaping the industry
• **Future Outlook**: Predictions and emerging opportunities
• **Best Practices**: Actionable recommendations for success

## Deep Dive Analysis

${style.analysis} that ${topic} is not just a trend, but a fundamental shift in how we approach ${category}. The implications are far-reaching and affect multiple stakeholders.

### Current State
The ${category} sector is experiencing unprecedented changes. ${capitalizedTopic} has become a catalyst for innovation, driving new methodologies and approaches.

### Challenges and Opportunities
While ${topic} presents exciting opportunities, it also brings unique challenges that organizations must navigate carefully.

## Practical Applications

1. **Implementation Strategy**: How to effectively integrate ${topic} into existing ${category} frameworks
2. **Risk Management**: Identifying and mitigating potential pitfalls
3. **Performance Metrics**: Measuring success and ROI
4. **Scaling Considerations**: Growing ${topic} initiatives sustainably

## Conclusion

${style.conclusion} ${topic} will continue to be a driving force in ${category}. Organizations that embrace this evolution and adapt their strategies accordingly will be best positioned for future success.

The journey ahead requires careful planning, continuous learning, and strategic implementation. By understanding the nuances of ${topic} and its impact on ${category}, we can make informed decisions that drive meaningful results.

---
*Generated with AI • ${new Date().toLocaleDateString()} • Credits used: 1*`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (!formData.prompt || !formData.tone || !formData.category) {
      setError("Please fill in all fields");
      return;
    }


    if (credits.used >= credits.total) {
      setError("You've reached your monthly credit limit. Please upgrade your plan to continue.");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      setTimeout(() => {

        const content = generateBlogContent(formData.prompt, formData.tone, formData.category);
        setGeneratedContent(content);
        

        setCredits(prev => ({
          ...prev,
          used: prev.used + 1
        }));
        
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      setError("Failed to generate content. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        color: 'white',
        padding: '20px',
        paddingTop: '100px',
        position: 'relative'
      }}
    >
      <MobileSafeBackground />
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div 
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: 'clamp(20px, 4vw, 40px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          <h2 
            style={{
              fontSize: 'clamp(20px, 5vw, 28px)',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '30px',
              background: 'linear-gradient(to right, #a855f7, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            AI Blog Post Generator
          </h2>


          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
              gap: '10px', 
              marginBottom: '20px' 
            }}
          >
            <div 
              style={{
                textAlign: 'center',
                background: 'linear-gradient(to right, #8b5cf6, #3b82f6)',
                padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
                borderRadius: '20px',
                fontSize: 'clamp(12px, 2.5vw, 14px)'
              }}
            >
              Free Plan
            </div>
            <div 
              style={{
                textAlign: 'center',
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
                borderRadius: '20px',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}
            >
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: credits.used >= credits.total ? '#ef4444' : '#10b981',
                display: 'inline-block'
              }} />
              Credits: {credits.total - credits.used} / {credits.total}
            </div>
          </div>


          {credits.used >= credits.total && (
            <div 
              style={{
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                textAlign: 'center',
                marginBottom: '20px'
              }}
            >
              ⚠️ You've used all your credits! <Link to="/plans" style={{ color: '#a855f7', textDecoration: 'underline' }}>Upgrade your plan</Link> to continue generating content.
            </div>
          )}


          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(15px, 3vw, 20px)' }}>

            <div>
              <label 
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  color: '#d1d5db'
                }}
              >
                Enter a topic or idea
              </label>
              <input
                type="text"
                name="prompt"
                value={formData.prompt}
                onChange={handleInputChange}
                placeholder="Enter a topic or idea"
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 2.5vw, 14px)',
                  background: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  boxSizing: 'border-box'
                }}
              />
            </div>


            <div>
              <label 
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  color: '#d1d5db'
                }}
              >
                Select Tone
              </label>
              <select
                name="tone"
                value={formData.tone}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 2.5vw, 14px)',
                  background: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Choose a tone...</option>
                <option value="formal">Formal</option>
                <option value="informal">Informal</option>
                <option value="humorous">Humorous</option>
              </select>
            </div>


            <div>
              <label 
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  color: '#d1d5db'
                }}
              >
                Select Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 2.5vw, 14px)',
                  background: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Choose a category...</option>
                <option value="technology">Technology</option>
                <option value="health">Health</option>
                <option value="business">Business</option>
              </select>
            </div>


            {error && (
              <div 
                style={{
                  padding: '12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#f87171',
                  fontSize: 'clamp(12px, 2.5vw, 14px)'
                }}
              >
                {error}
              </div>
            )}


            <button
              type="submit"
              disabled={isLoading || credits.used >= credits.total}
              style={{
                width: '100%',
                padding: 'clamp(12px, 3vw, 16px)',
                background: (isLoading || credits.used >= credits.total) ? '#6b7280' : 'linear-gradient(to right, #8b5cf6, #3b82f6)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: 'clamp(14px, 3.5vw, 18px)',
                fontWeight: '600',
                cursor: (isLoading || credits.used >= credits.total) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isLoading ? 'Generating...' : credits.used >= credits.total ? 'No Credits Available' : 'Generate Content'}
            </button>


            <Link 
              to="/history" 
              style={{
                textAlign: 'center',
                color: '#d1d5db',
                textDecoration: 'none',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                padding: 'clamp(6px, 1.5vw, 10px)'
              }}
            >
              View History
            </Link>
          </form>


          {generatedContent && (
            <div 
              style={{
                marginTop: 'clamp(20px, 4vw, 30px)',
                padding: 'clamp(15px, 3vw, 25px)',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
            >
              <h3 
                style={{
                  fontSize: 'clamp(16px, 4vw, 20px)',
                  fontWeight: '600',
                  marginBottom: '15px',
                  background: 'linear-gradient(to right, #a855f7, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Generated Content:
              </h3>
              <div 
                style={{
                  color: '#f3f4f6',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-wrap',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
                dangerouslySetInnerHTML={{
                  __html: generatedContent
                    .replace(/^# (.*$)/gm, '<h1 style="color: #a855f7; font-size: clamp(18px, 4vw, 24px); font-weight: bold; margin: 20px 0 15px 0; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);">$1</h1>')
                    .replace(/^## (.*$)/gm, '<h2 style="color: #3b82f6; font-size: clamp(16px, 3.5vw, 20px); font-weight: 600; margin: 18px 0 12px 0; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);">$1</h2>')
                    .replace(/^### (.*$)/gm, '<h3 style="color: #8b5cf6; font-size: clamp(15px, 3vw, 18px); font-weight: 600; margin: 15px 0 10px 0; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);">$1</h3>')
                    .replace(/^• (.*$)/gm, '<li style="margin: 8px 0; padding-left: 5px; color: #f3f4f6;">$1</li>')
                    .replace(/^\d+\. (.*$)/gm, '<li style="margin: 8px 0; padding-left: 5px; color: #f3f4f6; list-style-type: decimal;">$1</li>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #ffffff; font-weight: 600;">$1</strong>')
                    .replace(/\n\n/g, '</p><p style="margin: 12px 0; color: #f3f4f6; line-height: 1.7;">')
                    .replace(/^(?!<[h|l|p])(.+)$/gm, '<p style="margin: 12px 0; color: #f3f4f6; line-height: 1.7;">$1</p>')
                }}
              />
              <div 
                style={{
                  marginTop: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  color: '#9ca3af',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <span>Credits Remaining: {credits.total - credits.used} / {credits.total}</span>
                <Link 
                  to="/plans" 
                  style={{
                    color: '#a855f7',
                    textDecoration: 'none'
                  }}
                >
                  Upgrade Plan →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPostAIAssistant;