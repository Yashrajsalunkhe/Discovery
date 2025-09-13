import React, { useState } from 'react'
import { Search, ChevronDown, ChevronUp, Download, BookOpen } from 'lucide-react'
import { eventsData } from '../data/events'

const EventRules = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedEvents, setExpandedEvents] = useState(new Set())

  // Filter events based on search
  const filteredEvents = eventsData.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.rules.some(rule => rule.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const toggleEventExpansion = (eventId) => {
    const newExpanded = new Set(expandedEvents)
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId)
    } else {
      newExpanded.add(eventId)
    }
    setExpandedEvents(newExpanded)
  }

  const expandAll = () => {
    setExpandedEvents(new Set(filteredEvents.map(event => event.id)))
  }

  const collapseAll = () => {
    setExpandedEvents(new Set())
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Event Rules & Regulations
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Detailed rules and regulations for all technical events at Discovery 2K25. 
            Please read carefully before participating.
          </p>
        </div>
      </section>

      {/* Search and Controls */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search event rules..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <button
                onClick={expandAll}
                className="btn-outline text-sm"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="btn-outline text-sm"
              >
                Collapse All
              </button>
              <button className="btn-primary text-sm">
                <Download className="w-4 h-4 mr-2" />
                Download All Rules
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing rules for {filteredEvents.length} of {eventsData.length} events
          </div>
        </div>
      </section>

      {/* Rules Content */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No rules found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search terms.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => {
                const isExpanded = expandedEvents.has(event.id)
                
                return (
                  <div key={event.id} className="accordion-item">
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleEventExpansion(event.id)}
                      className="accordion-header"
                    >
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold">{event.name}</h3>
                          <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-xs rounded-full">
                            {event.department}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {event.rules.length} rule{event.rules.length !== 1 ? 's' : ''} • Max {event.maxTeamSize} member{event.maxTeamSize > 1 ? 's' : ''}
                        </p>
                      </div>
                      
                      <div className="ml-4">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </button>

                    {/* Accordion Content */}
                    {isExpanded && (
                      <div className="accordion-content">
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Event Description
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {event.description}
                          </p>
                        </div>

                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Rules & Regulations
                            </h4>
                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                              <Download className="w-4 h-4 mr-1" />
                              Download PDF
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            {event.rules.map((rule, index) => (
                              <div key={index} className="flex items-start">
                                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-semibold mr-4 mt-0.5 flex-shrink-0">
                                  {index + 1}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                  {rule}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                              Event Details
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Department:</span>
                                <span className="text-gray-900 dark:text-white">{event.department}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Max Team Size:</span>
                                <span className="text-gray-900 dark:text-white">{event.maxTeamSize} member{event.maxTeamSize > 1 ? 's' : ''}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Entry Fee:</span>
                                <span className="text-gray-900 dark:text-white">₹{event.entryFee} per participant</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Category:</span>
                                <span className="text-gray-900 dark:text-white capitalize">{event.category}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                              Coordinators
                            </h4>
                            <div className="space-y-3">
                              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                  Faculty: {event.coordinators.faculty.name}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                  {event.coordinators.faculty.contact}
                                </p>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                  Student: {event.coordinators.student.name}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                  {event.coordinators.student.contact}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <button 
                            onClick={() => window.open(`/events/${event.id}`, '_blank')}
                            className="btn-outline text-sm"
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                          <button 
                            onClick={() => window.open(`/registration/${event.id}`, '_blank')}
                            className="btn-primary text-sm"
                          >
                            Register for Event
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* General Rules Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            General Rules & Guidelines
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Registration Guidelines
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• All participants must register online before the deadline</li>
                <li>• Entry fee must be paid during registration</li>
                <li>• Team formation is event-specific</li>
                <li>• College ID cards are mandatory</li>
                <li>• No spot registrations will be entertained</li>
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Event Day Guidelines
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Report 30 minutes before event time</li>
                <li>• Bring required documents and equipment</li>
                <li>• Follow COVID-19 safety protocols</li>
                <li>• Judges' decisions are final</li>
                <li>• No electronic devices allowed unless specified</li>
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Code of Conduct
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Maintain professional behavior</li>
                <li>• No plagiarism or unfair practices</li>
                <li>• Respect fellow participants and organizers</li>
                <li>• Follow time limits strictly</li>
                <li>• Any violation may lead to disqualification</li>
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Prizes & Certificates
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Winner, Runner-up prizes for each event</li>
                <li>• Participation certificates for all</li>
                <li>• Special recognition for innovation</li>
                <li>• Results will be announced on event day</li>
                <li>• Prize distribution ceremony at the end</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EventRules