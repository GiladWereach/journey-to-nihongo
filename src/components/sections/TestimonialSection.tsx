
import React from 'react';

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-indigo text-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Learners Say</h2>
          <div className="w-20 h-1 bg-vermilion mx-auto"></div>
        </div>
        
        <div className="relative p-8 md:p-12 bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden">
          <svg className="absolute -top-6 -left-6 text-white/20" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.9999 9.5C11.9999 7.84 10.6599 6.5 8.99994 6.5H6.99994V8.5H8.99994C9.54994 8.5 9.99994 8.95 9.99994 9.5V11.5C9.99994 12.05 9.54994 12.5 8.99994 12.5H6.99994V14.5H8.99994C10.6599 14.5 11.9999 13.16 11.9999 11.5V9.5ZM17.9999 9.5C17.9999 7.84 16.6599 6.5 14.9999 6.5H12.9999V8.5H14.9999C15.5499 8.5 15.9999 8.95 15.9999 9.5V11.5C15.9999 12.05 15.5499 12.5 14.9999 12.5H12.9999V14.5H14.9999C16.6599 14.5 17.9999 13.16 17.9999 11.5V9.5Z" />
          </svg>
          
          <div className="text-center">
            <p className="text-lg md:text-xl italic mb-8">
              "Nihongo Journey transformed my approach to Japanese learning. Unlike other apps I've tried, it focuses on practical language skills and cultural context, not just memorization. After six months, I was able to have real conversations with native speakers."
            </p>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-vermilion/20 mb-4 flex items-center justify-center">
                <span className="text-vermilion font-bold text-xl">AT</span>
              </div>
              <h4 className="text-lg font-semibold">Amanda T.</h4>
              <p className="text-white/70">JLPT N3 Certified</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <button className="w-3 h-3 rounded-full bg-white/30 mx-1 hover:bg-white/70 transition-colors"></button>
          <button className="w-3 h-3 rounded-full bg-white mx-1"></button>
          <button className="w-3 h-3 rounded-full bg-white/30 mx-1 hover:bg-white/70 transition-colors"></button>
          <button className="w-3 h-3 rounded-full bg-white/30 mx-1 hover:bg-white/70 transition-colors"></button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
