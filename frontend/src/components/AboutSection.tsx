import { useState, useEffect } from "react";
import { Sparkles, Code, Trophy, Users } from "lucide-react";

export const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('about-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Code,
      title: "Innovation",
      description: "Cutting-edge tech solutions across engineering domains",
      details: "From AI & ML to IoT, blockchain to robotics - explore the latest technological frontiers with hands-on challenges that push the boundaries of what's possible.",
      stats: "15+ Tech Events",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: Trophy,
      title: "Excellence", 
      description: "National-level competition with industry recognition",
      details: "Compete with the brightest minds from across the country. Industry experts judge your innovations, offering mentorship and potential career opportunities.",
      stats: "₹1L+ Cash Prizes",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Community",
      description: "24+ diverse disciplines united by innovation",
      details: "Connect with like-minded innovators from Computer Science, Mechanical, Electrical, Civil, Management, and Food Technology backgrounds.",
      stats: "1000+ Participants",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section 
      id="about-section"
      className="min-h-screen flex items-center justify-center py-20 sm:py-32 px-4 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 sm:mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/30 mb-6 sm:mb-8">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">About Discovery</span>
          </div>
          
          <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent">
              Future of
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Innovation
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed opacity-90">
            A national platform where creativity meets technology, 
            fostering the next generation of innovators.
          </p>
        </div>

        {/* Information Paragraph */}
        <div className={`max-w-4xl mx-auto mb-12 sm:mb-20 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-gray-900/30 to-gray-800/20 backdrop-blur-xl border border-gray-700/30">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
            <div className="relative">
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-4">
                <span className="text-cyan-400 font-semibold">Discovery 2K25</span> is more than just a technical festival—it's a transformative journey that brings together the brightest minds from engineering, management, information technology, and food technology disciplines. Organized annually, this prestigious event has evolved into a cornerstone of academic excellence and innovation.
              </p>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-4">
                Our mission is to create an ecosystem where theoretical knowledge meets practical application, where ideas transform into reality, and where students don't just participate—they <span className="text-purple-400 font-semibold">innovate, collaborate, and lead</span>. With industry partnerships, expert mentorship, and cutting-edge challenges, Discovery provides unparalleled opportunities for skill development and career advancement.
              </p>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                Whether you're passionate about <span className="text-pink-400 font-semibold">artificial intelligence</span>, <span className="text-orange-400 font-semibold">sustainable engineering</span>, <span className="text-green-400 font-semibold">business innovation</span>, or <span className="text-yellow-400 font-semibold">culinary technology</span>—Discovery 2K25 offers a platform to showcase your talent, learn from industry leaders, and connect with a community that shares your vision for the future.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group relative transition-all duration-700 delay-${index * 200} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group-hover:scale-105 min-h-[320px]">
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`}></div>
                  
                  {/* Icon */}
                  <div className={`relative w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Stats Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${feature.gradient} text-white opacity-90`}>
                    {feature.stats}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 text-lg mb-4 leading-relaxed font-medium">
                    {feature.description}
                  </p>

                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className={`text-center transition-all duration-1000 delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-gradient-to-r from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                ₹100
              </span>
              <span className="text-gray-300 text-lg">/participant</span>
            </div>
            <div className="h-8 w-px bg-gray-600"></div>
            <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
              Join the future
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};