import React from 'react'
import { Phone, Mail, User, Building, Award } from 'lucide-react'
import { committeeData } from '../data/events'

const Committee = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Organizing Committee
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Meet the dedicated team behind Discovery 2K25. Our faculty and student coordinators 
            are here to ensure a smooth and successful event.
          </p>
        </div>
      </section>

      {/* Central Committee */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title text-gray-900 dark:text-white">
              <span className="gradient-text">Central Committee</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The core leadership team overseeing all aspects of Discovery 2K25.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {committeeData.central.map((member, index) => (
              <div key={index} className="card p-6 text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <User className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                
                <div className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-sm rounded-full mb-4">
                  <Award className="w-4 h-4 mr-1" />
                  {member.position}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{member.contact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Department Coordinators */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title text-gray-900 dark:text-white">
              Department <span className="gradient-text">Coordinators</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Faculty heads leading their respective department's events and activities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {committeeData.departments.map((dept, index) => (
              <div key={index} className="card p-8 group">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {dept.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">Department</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Department Head
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">
                      {dept.head}
                    </p>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4 mr-2" />
                      <span className="text-sm">{dept.contact}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Managed Events
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {dept.events.map((event, eventIndex) => (
                      <span
                        key={eventIndex}
                        className="px-3 py-1 bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-400 text-sm rounded-full"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Coordinators */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title text-gray-900 dark:text-white">
              Event <span className="gradient-text">Coordinators</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Faculty and student coordinators for each individual event. Contact them for event-specific queries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                event: 'Coding Competition',
                faculty: { name: 'Dr. A. B. Patil', contact: '+91 9876543210' },
                student: { name: 'Rahul Sharma', contact: '+91 8765432109' },
                department: 'Computer Engineering'
              },
              {
                event: 'Web Development Challenge',
                faculty: { name: 'Prof. C. D. Desai', contact: '+91 9876543211' },
                student: { name: 'Priya Patel', contact: '+91 8765432108' },
                department: 'Information Technology'
              },
              {
                event: 'Robotics Challenge',
                faculty: { name: 'Dr. E. F. Joshi', contact: '+91 9876543212' },
                student: { name: 'Arjun Singh', contact: '+91 8765432107' },
                department: 'Mechanical Engineering'
              },
              {
                event: 'Circuit Design Competition',
                faculty: { name: 'Prof. G. H. Kumar', contact: '+91 9876543213' },
                student: { name: 'Sneha Reddy', contact: '+91 8765432106' },
                department: 'Electronics Engineering'
              },
              {
                event: 'Data Science Hackathon',
                faculty: { name: 'Dr. I. J. Mehta', contact: '+91 9876543214' },
                student: { name: 'Vikash Gupta', contact: '+91 8765432105' },
                department: 'Computer Engineering'
              },
              {
                event: 'Mobile App Development',
                faculty: { name: 'Prof. K. L. Shah', contact: '+91 9876543215' },
                student: { name: 'Anita Verma', contact: '+91 8765432104' },
                department: 'Information Technology'
              }
            ].map((coordinator, index) => (
              <div key={index} className="card p-6 group">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors duration-300">
                    {coordinator.event}
                  </h3>
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-sm rounded-full">
                    {coordinator.department}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                      Faculty Coordinator
                    </h4>
                    <p className="font-medium text-gray-900 dark:text-white mb-1">
                      {coordinator.faculty.name}
                    </p>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4 mr-2" />
                      <span className="text-sm">{coordinator.faculty.contact}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                      Student Coordinator
                    </h4>
                    <p className="font-medium text-gray-900 dark:text-white mb-1">
                      {coordinator.student.name}
                    </p>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4 mr-2" />
                      <span className="text-sm">{coordinator.student.contact}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding bg-primary-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            General Inquiries
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Main Coordinator</h3>
                <p className="text-gray-200">Mr. S. V. Nishandar</p>
                <p className="text-gray-200">+91 9657028810</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
                <p className="text-gray-200">discovery2k25@adcet.in</p>
                <p className="text-gray-200">info@adcet.in</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Institution</h3>
                <p className="text-gray-200">ADCET, Ashta</p>
                <p className="text-gray-200">Sangli, Maharashtra</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Committee