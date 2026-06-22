import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Target, Users, BookOpen } from 'lucide-react';
import aboutImg from '../assets/About.png.png';

const AboutTXHub = () => {
  const features = [
    {
      icon: <Target className="w-6 h-6 text-blue-600" />,
      title: "Our Mission",
      description: "To bridge the gap between academia and industry by providing practical, job-ready skills."
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Expert Mentors",
      description: "Learn directly from industry veterans with years of hands-on experience."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      title: "Practical Learning",
      description: "Focus on real-world projects and case studies rather than just theory."
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Content */}
        <motion.div
  initial={{ opacity: 0, x: -30 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
  className="space-y-6 md:space-y-8 text-center lg:text-left"
>
            <div>
              <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-4 border border-blue-100">
                About TXHub
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                Empowering the next generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">tech leaders</span>
              </h2>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                TXHub is an elite learning platform designed to transform ambitious learners into highly sought-after professionals. We combine cutting-edge curriculum with immersive, hands-on training to ensure you are ready for the modern workplace from day one.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100/50">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{feature.title}</h4>
                    <p className="text-slate-600 mt-1">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Visual/Stats */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square md:aspect-[4/3] lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-200 relative">
              <img 
                src={aboutImg} 
                alt="Students collaborating" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              
              {/* Overlay Stats Card */}
              {/* <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">
                <div className="grid grid-cols-3 gap-4 text-center divide-x divide-white/20">
                  <div>
                    <div className="text-3xl font-black">10k+</div>
                    <div className="text-xs font-medium text-slate-300 mt-1 uppercase tracking-wider">Students</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black">50+</div>
                    <div className="text-xs font-medium text-slate-300 mt-1 uppercase tracking-wider">Courses</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black">95%</div>
                    <div className="text-xs font-medium text-slate-300 mt-1 uppercase tracking-wider">Placement</div>
                  </div>
                </div>
              </div> */}
            </div>
            
            {/* Floating element */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden md:block animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="text-emerald-600 w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Certified Quality</div>
                  <div className="text-xs text-slate-500">Industry recognized</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutTXHub;
