import React from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Calendar, MapPin, Users, Phone, Mail, ArrowLeft, Download, ArrowRight, Clock, Trophy, DollarSign } from 'lucide-react'
import { eventsData } from '../data/events'

const EventDetails = () => {
  const { eventId } = useParams()
  const event = eventsData.find(e => e.id === eventId)

  if (!event) {
    return <Navigate to="/events" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <section className="bg-white dark:bg-gray-800 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom">
          <Link 
            to="/events" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </section>

      {/* Event Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="container-custom">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                {event.department}
              </span>
              <span className="px-3 py-1 bg-secondary-500 text-white text-sm rounded-full capitalize">
                {event.category}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {event.name}
            </h1>
            
            <p className="text-xl text-gray-200 mb-8 max-w-3xl">
              {event.description}
            </p>

            {/* Quick Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center text-white mb-2">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="font-medium">Date</span>
                </div>
                <p className="text-gray-200">11th October 2025</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center text-white mb-2">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="font-medium">Team Size</span>
                </div>
                <p className="text-gray-200">Max {event.maxTeamSize} member{event.maxTeamSize > 1 ? 's' : ''}</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center text-white mb-2">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span className="font-medium">Entry Fee</span>
                </div>
                <p className="text-gray-200">₹{event.entryFee} per participant</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center text-white mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="font-medium">Venue</span>
                </div>
                <p className="text-gray-200">ADCET Campus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  About This Event
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {event.description}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                    This event is designed to challenge participants and showcase their technical skills in {event.category}. 
                    Join us for an exciting competition that will test your abilities and provide valuable learning experiences.
                  </p>
                </div>
              </div>

              {/* Rules & Regulations */}
              <div className="card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Rules & Regulations
                  </h2>
                  <button className="btn-outline text-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </button>
                </div>
                
                <ul className="space-y-3">
                  {event.rules.map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-600 dark:text-gray-300">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Timeline */}
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Event Timeline
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Registration Opens</p>
                      <p className="text-sm text-gray-500">September 15, 2025</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mr-4">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Registration Deadline</p>
                      <p className="text-sm text-gray-500">October 8, 2025</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-4">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Event Day</p>
                      <p className="text-sm text-gray-500">October 11, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <div className="card p-6 sticky top-8">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-secondary-600 mb-2">
                    ₹{event.entryFee}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">per participant</p>
                </div>
                
                <Link 
                  to={`/registration/${event.id}`}
                  className="btn-primary w-full mb-4"
                >
                  Register Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Registration closes on October 8, 2025
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Quick Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max Team Size:</span>
                      <span className="text-gray-900 dark:text-white">{event.maxTeamSize} member{event.maxTeamSize > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Department:</span>
                      <span className="text-gray-900 dark:text-white">{event.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span className="text-gray-900 dark:text-white capitalize">{event.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coordinators */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Event Coordinators
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Faculty Coordinator</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {event.coordinators.faculty.name}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{event.coordinators.faculty.contact}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Student Coordinator</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {event.coordinators.student.name}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{event.coordinators.student.contact}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    For any queries regarding this event, contact the coordinators above.
                  </p>
                </div>
              </div>

              {/* Share Event */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Share This Event
                </h3>
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm transition-colors duration-200">
                    Facebook
                  </button>
                  <button className="flex-1 bg-blue-400 hover:bg-blue-500 text-white py-2 px-3 rounded-md text-sm transition-colors duration-200">
                    Twitter
                  </button>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md text-sm transition-colors duration-200">
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Events */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Other Events You Might Like
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsData
              .filter(e => e.id !== event.id && e.department === event.department)
              .slice(0, 3)
              .map(relatedEvent => (
                <div key={relatedEvent.id} className="card p-6 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-sm rounded-full">
                      {relatedEvent.department}
                    </span>
                    <span className="text-sm text-gray-500">₹{relatedEvent.entryFee}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                    {relatedEvent.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {relatedEvent.description}
                  </p>
                  
                  <Link 
                    to={`/events/${relatedEvent.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                  >
                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default EventDetails