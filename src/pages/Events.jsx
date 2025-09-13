import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Users, Calendar, MapPin, ArrowRight, Grid, List } from 'lucide-react'
import { eventsData } from '../data/events'

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  // Get unique departments and categories
  const departments = [...new Set(eventsData.map(event => event.department))]
  const categories = [...new Set(eventsData.map(event => event.category))]

  // Filter events based on search and filters
  const filteredEvents = eventsData.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !selectedDepartment || event.department === selectedDepartment
    const matchesCategory = !selectedCategory || event.category === selectedCategory
    
    return matchesSearch && matchesDepartment && matchesCategory
  })

  const EventCard = ({ event }) => (
    <div className="card p-6 group">
      {/* Event Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-sm rounded-full">
              {event.department}
            </span>
            <span className="px-2 py-1 bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-400 text-xs rounded-full capitalize">
              {event.category}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors duration-300">
            {event.name}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-secondary-600">₹{event.entryFee}</div>
          <div className="text-sm text-gray-500">per participant</div>
        </div>
      </div>

      {/* Event Description */}
      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
        {event.description}
      </p>

      {/* Event Details */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Users className="w-4 h-4 mr-2" />
          <span>Maximum team size: {event.maxTeamSize} member{event.maxTeamSize > 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-2" />
          <span>11th October 2025</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="w-4 h-4 mr-2" />
          <span>ADCET Campus, Ashta</span>
        </div>
      </div>

      {/* Coordinators */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Coordinators</h4>
        <div className="space-y-1">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Faculty:</strong> {event.coordinators.faculty.name}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Student:</strong> {event.coordinators.student.name}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link 
          to={`/events/${event.id}`}
          className="flex-1 btn-outline text-center"
        >
          View Details
        </Link>
        <Link 
          to={`/registration/${event.id}`}
          className="flex-1 btn-primary text-center"
        >
          Register
          <ArrowRight className="w-4 h-4 ml-2 inline" />
        </Link>
      </div>
    </div>
  )

  const EventListItem = ({ event }) => (
    <div className="card p-6 group">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Event Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-sm rounded-full">
              {event.department}
            </span>
            <span className="px-2 py-1 bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-400 text-xs rounded-full capitalize">
              {event.category}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors duration-300">
            {event.name}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            {event.description}
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Max {event.maxTeamSize} members
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              11th October 2025
            </div>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex flex-col items-end gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-secondary-600">₹{event.entryFee}</div>
            <div className="text-sm text-gray-500">per participant</div>
          </div>
          
          <div className="flex gap-3">
            <Link 
              to={`/events/${event.id}`}
              className="btn-outline px-4 py-2 text-sm"
            >
              Details
            </Link>
            <Link 
              to={`/registration/${event.id}`}
              className="btn-primary px-4 py-2 text-sm"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Technical Events
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Explore our exciting range of technical competitions and challenges. 
            Choose your event and register to be part of Discovery 2K25.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <select
                className="form-input min-w-[150px]"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                className="form-input min-w-[120px]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat} className="capitalize">{cat}</option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-600 text-primary-600 shadow' 
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-gray-600 text-primary-600 shadow' 
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredEvents.length} of {eventsData.length} events
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="section-padding">
        <div className="container-custom">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No events found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }>
              {filteredEvents.map(event => 
                viewMode === 'grid' 
                  ? <EventCard key={event.id} event={event} />
                  : <EventListItem key={event.id} event={event} />
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Participate?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Register for your chosen events and be part of the excitement.
          </p>
          <Link to="/registration" className="btn-secondary">
            Register Now
            <ArrowRight className="w-5 h-5 ml-2 inline" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Events