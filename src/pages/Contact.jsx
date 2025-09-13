import React, { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Have questions about Discovery 2K25? We're here to help! Reach out to us for 
            any inquiries, support, or information about the event.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Send us a Message
              </h2>
              
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                  <p className="text-green-800 dark:text-green-200">
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="form-label">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`form-input ${errors.subject ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="registration">Registration Help</option>
                    <option value="events">Event Information</option>
                    <option value="payment">Payment Issues</option>
                    <option value="technical">Technical Support</option>
                    <option value="sponsorship">Sponsorship</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className={`form-input ${errors.message ? 'border-red-500' : ''}`}
                    placeholder="Enter your message..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="loading-spinner mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </div>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  Get in Touch
                </h2>
                
                <div className="space-y-6">
                  {/* Main Coordinator */}
                  <div className="card p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center mr-4">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Main Coordinator
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">For general inquiries</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        Mr. S. V. Nishandar
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        +91 9657028810
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="card p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-400 rounded-lg flex items-center justify-center mr-4">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Email Support
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">Send us an email</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-600 dark:text-gray-300">
                        discovery2k25@adcet.in
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        info@adcet.in
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="card p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center mr-4">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Event Location
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">Visit us at</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-600 dark:text-gray-300">
                        Annasaheb Dange College of Engineering and Technology
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        Ashta, Sangli District
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        Maharashtra, India - 416301
                      </p>
                    </div>
                  </div>

                  {/* Event Timing */}
                  <div className="card p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mr-4">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Event Schedule
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">Mark your calendar</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-600 dark:text-gray-300">
                        <strong>Event Date:</strong> 11th October 2025
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        <strong>Time:</strong> 9:00 AM onwards
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        <strong>Registration Deadline:</strong> 8th October 2025
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Follow Us
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Stay updated with the latest news and announcements about Discovery 2K25.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-blue-400 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-pink-600 hover:bg-pink-700 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Find Us on Map
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Located in the heart of Ashta, easily accessible from major cities.
            </p>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center">
            {/* Placeholder for map - in a real application, you'd integrate with Google Maps or similar */}
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">Interactive Map</p>
              <p className="text-sm text-gray-400">
                ADCET, Ashta, Sangli District, Maharashtra, India
              </p>
              <button className="btn-primary mt-4">
                Open in Google Maps
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Quick answers to common questions about Discovery 2K25.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How do I register for events?",
                answer: "You can register online through our registration page. Select your event, fill in your details, and complete the payment to confirm your registration."
              },
              {
                question: "What is the entry fee for events?",
                answer: "The entry fee is ₹100 per participant for all events. Team events require payment for each team member."
              },
              {
                question: "Can I participate in multiple events?",
                answer: "Yes, you can register for multiple events. However, make sure there are no time conflicts between your selected events."
              },
              {
                question: "What should I bring on the event day?",
                answer: "Bring your college ID card, registration confirmation, and any specific equipment mentioned in the event rules. Some events may require laptops or other tools."
              },
              {
                question: "Is accommodation provided?",
                answer: "We can help arrange accommodation for outstation participants. Contact us for more details about nearby hotels and hostels."
              },
              {
                question: "How will winners be announced?",
                answer: "Results will be announced on the event day itself. Winners will receive certificates and prize money during the closing ceremony."
              }
            ].map((faq, index) => (
              <div key={index} className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact