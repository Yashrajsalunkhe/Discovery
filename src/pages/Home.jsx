import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, Trophy, MapPin, ArrowRight, Zap, Code, Cpu, Palette } from 'lucide-react'
import { useCountdown } from '../hooks/useCountdown'
import { eventStats, eventsData } from '../data/events'

const CountdownTimer = () => {
  const eventDate = new Date('2025-10-11T09:00:00')
  const timeLeft = useCountdown(eventDate)

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ]

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      {timeUnits.map((unit) => (
        <div key={unit.label} className="countdown-item">
          <div className="countdown-number">{unit.value.toString().padStart(2, '0')}</div>
          <div className="countdown-label">{unit.label}</div>
        </div>
      ))}
    </div>
  )
}

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-secondary-500/20 rounded-full animate-float"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-secondary-400/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-secondary-600/20 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="container-custom text-center relative z-10">
        <div className="animate-fade-in">
          {/* Event Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white mb-8">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">11th October 2025</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title text-white mb-6 text-shadow animate-slide-up">
            <span className="block">Discovery</span>
            <span className="block gradient-text bg-gradient-to-r from-secondary-400 to-secondary-600 bg-clip-text text-transparent">
              2K25
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Central Technical Event of ADCET
          </p>
          
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Annasaheb Dange College of Engineering and Technology, Ashta
          </p>

          {/* Countdown Timer */}
          <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-2xl text-white mb-4">Event Starts In</h3>
            <CountdownTimer />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <Link to="/registration" className="btn-secondary text-lg px-8 py-4">
              Register Now
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Link>
            <Link to="/events" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4">
              View Events
            </Link>
          </div>

          {/* Event Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 animate-slide-up" style={{ animationDelay: '1s' }}>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-secondary-400 mb-2">{eventStats.totalEvents}+</div>
              <div className="text-gray-300">Technical Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-secondary-400 mb-2">{eventStats.expectedParticipants}+</div>
              <div className="text-gray-300">Expected Participants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-secondary-400 mb-2">{eventStats.departments}</div>
              <div className="text-gray-300">Departments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-secondary-400 mb-2">{eventStats.prizes}</div>
              <div className="text-gray-300">Prize Money</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

const AboutSection = () => {
  const highlights = [
    {
      icon: Code,
      title: 'Programming Challenges',
      description: 'Test your coding skills in various programming competitions and hackathons.'
    },
    {
      icon: Cpu,
      title: 'Technical Innovations',
      description: 'Showcase your technical projects and innovative solutions to real-world problems.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with brilliant minds and build lasting professional networks.'
    },
    {
      icon: Trophy,
      title: 'Win Exciting Prizes',
      description: 'Compete for attractive prize money and recognition from industry experts.'
    }
  ]

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title text-gray-900 dark:text-white">
            Why Join <span className="gradient-text">Discovery 2K25?</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discovery 2K25 is more than just a technical event - it's a platform to showcase your skills, 
            learn from experts, and connect with like-minded innovators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => (
            <div key={highlight.title} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <highlight.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {highlight.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FeaturedEventsSection = () => {
  const featuredEvents = eventsData.slice(0, 3)

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title text-gray-900 dark:text-white">
            Featured <span className="gradient-text">Events</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore some of our most exciting technical competitions and challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((event) => (
            <div key={event.id} className="card p-6 group">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-sm rounded-full">
                  {event.department}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ₹{event.entryFee}/participant
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 transition-colors duration-300">
                {event.name}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {event.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-1" />
                  Max {event.maxTeamSize} members
                </div>
                <Link 
                  to={`/events/${event.id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform duration-300"
                >
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/events" className="btn-primary">
            View All Events
            <ArrowRight className="w-5 h-5 ml-2 inline" />
          </Link>
        </div>
      </div>
    </section>
  )
}

const CtaSection = () => {
  return (
    <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-800">
      <div className="container-custom text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Showcase Your Skills?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Join hundreds of talented students from across Maharashtra in this premier technical event.
            Register now and be part of something extraordinary.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/registration" className="btn-secondary text-lg px-8 py-4">
              Register Now
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Link>
            <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4">
              Contact Us
            </Link>
          </div>
          
          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-200">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>ADCET, Ashta, Sangli</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>11th October 2025</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-lg">
                Contact: <strong>Mr. S. V. Nishandar - +91 9657028810</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const Home = () => {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <FeaturedEventsSection />
      <CtaSection />
    </div>
  )
}

export default Home