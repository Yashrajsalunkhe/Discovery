import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Users, CreditCard, CheckCircle, AlertCircle, Plus, Minus } from 'lucide-react'
import { eventsData } from '../data/events'

const Registration = () => {
  const { eventId } = useParams()
  const selectedEvent = eventId ? eventsData.find(e => e.id === eventId) : null

  const [formData, setFormData] = useState({
    participantName: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: '',
    selectedEvent: selectedEvent?.id || '',
    teamMembers: [],
    paymentMethod: 'upi',
    transactionId: '',
    agreeToTerms: false,
    agreeToPrivacy: false
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const maxTeamSize = selectedEvent ? selectedEvent.maxTeamSize : 1
  const entryFee = selectedEvent ? selectedEvent.entryFee : 100
  const totalFee = (formData.teamMembers.length + 1) * entryFee

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleEventChange = (eventId) => {
    const event = eventsData.find(e => e.id === eventId)
    setFormData(prev => ({
      ...prev,
      selectedEvent: eventId,
      teamMembers: [] // Reset team members when event changes
    }))
  }

  const addTeamMember = () => {
    if (formData.teamMembers.length < maxTeamSize - 1) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, { name: '', email: '', phone: '' }]
      }))
    }
  }

  const removeTeamMember = (index) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }))
  }

  const updateTeamMember = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    // Basic validation
    if (!formData.participantName.trim()) newErrors.participantName = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits'
    if (!formData.college.trim()) newErrors.college = 'College name is required'
    if (!formData.department.trim()) newErrors.department = 'Department is required'
    if (!formData.year) newErrors.year = 'Year is required'
    if (!formData.selectedEvent) newErrors.selectedEvent = 'Please select an event'
    if (!formData.transactionId.trim()) newErrors.transactionId = 'Transaction ID is required'
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms and conditions'
    if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = 'You must agree to privacy policy'

    // Team member validation
    formData.teamMembers.forEach((member, index) => {
      if (!member.name.trim()) newErrors[`teamMember${index}Name`] = 'Team member name is required'
      if (!member.email.trim()) newErrors[`teamMember${index}Email`] = 'Team member email is required'
      else if (!/\S+@\S+\.\S+/.test(member.email)) newErrors[`teamMember${index}Email`] = 'Team member email is invalid'
      if (!member.phone.trim()) newErrors[`teamMember${index}Phone`] = 'Team member phone is required'
      else if (!/^\d{10}$/.test(member.phone)) newErrors[`teamMember${index}Phone`] = 'Team member phone must be 10 digits'
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSubmitSuccess(true)
      // Reset form or redirect
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-16">
        <div className="container-custom max-w-2xl">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Registration Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thank you for registering for Discovery 2K25. We have sent a confirmation email with event details and payment instructions.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Registration Details
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p><strong>Event:</strong> {eventsData.find(e => e.id === formData.selectedEvent)?.name}</p>
                <p><strong>Participants:</strong> {formData.teamMembers.length + 1}</p>
                <p><strong>Total Fee:</strong> ₹{totalFee}</p>
                <p><strong>Transaction ID:</strong> {formData.transactionId}</p>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.print()}
                className="btn-outline"
              >
                Print Confirmation
              </button>
              <button
                onClick={() => window.location.href = '/events'}
                className="btn-primary"
              >
                View Other Events
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Event Registration
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Register for Discovery 2K25 technical events. Fill out the form below to secure your spot.
          </p>
        </div>
      </section>

      {/* Registration Form */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Personal Information */}
                <div className="card p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <User className="w-6 h-6 mr-3" />
                    Personal Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        name="participantName"
                        value={formData.participantName}
                        onChange={handleInputChange}
                        className={`form-input ${errors.participantName ? 'border-red-500' : ''}`}
                        placeholder="Enter your full name"
                      />
                      {errors.participantName && (
                        <p className="text-red-500 text-sm mt-1">{errors.participantName}</p>
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

                    <div>
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="10-digit phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="form-label">College/Institution *</label>
                      <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleInputChange}
                        className={`form-input ${errors.college ? 'border-red-500' : ''}`}
                        placeholder="Enter college name"
                      />
                      {errors.college && (
                        <p className="text-red-500 text-sm mt-1">{errors.college}</p>
                      )}
                    </div>

                    <div>
                      <label className="form-label">Department *</label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className={`form-input ${errors.department ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select Department</option>
                        <option value="Computer Engineering">Computer Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Electronics Engineering">Electronics Engineering</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.department && (
                        <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                      )}
                    </div>

                    <div>
                      <label className="form-label">Year of Study *</label>
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className={`form-input ${errors.year ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select Year</option>
                        <option value="1">First Year</option>
                        <option value="2">Second Year</option>
                        <option value="3">Third Year</option>
                        <option value="4">Final Year</option>
                      </select>
                      {errors.year && (
                        <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Selection */}
                <div className="card p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Event Selection
                  </h2>
                  
                  <div>
                    <label className="form-label">Select Event *</label>
                    <select
                      name="selectedEvent"
                      value={formData.selectedEvent}
                      onChange={(e) => handleEventChange(e.target.value)}
                      className={`form-input ${errors.selectedEvent ? 'border-red-500' : ''}`}
                    >
                      <option value="">Choose an event</option>
                      {eventsData.map(event => (
                        <option key={event.id} value={event.id}>
                          {event.name} - {event.department} (₹{event.entryFee})
                        </option>
                      ))}
                    </select>
                    {errors.selectedEvent && (
                      <p className="text-red-500 text-sm mt-1">{errors.selectedEvent}</p>
                    )}
                  </div>

                  {selectedEvent && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {selectedEvent.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                        {selectedEvent.description}
                      </p>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <span>Max team size: {selectedEvent.maxTeamSize} • </span>
                        <span>Entry fee: ₹{selectedEvent.entryFee} per participant</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Team Members */}
                {selectedEvent && selectedEvent.maxTeamSize > 1 && (
                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Users className="w-6 h-6 mr-3" />
                        Team Members
                      </h2>
                      {formData.teamMembers.length < maxTeamSize - 1 && (
                        <button
                          type="button"
                          onClick={addTeamMember}
                          className="btn-outline text-sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Member
                        </button>
                      )}
                    </div>

                    <div className="space-y-6">
                      {formData.teamMembers.map((member, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Team Member {index + 1}
                            </h3>
                            <button
                              type="button"
                              onClick={() => removeTeamMember(index)}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="form-label">Name *</label>
                              <input
                                type="text"
                                value={member.name}
                                onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                                className={`form-input ${errors[`teamMember${index}Name`] ? 'border-red-500' : ''}`}
                                placeholder="Member name"
                              />
                              {errors[`teamMember${index}Name`] && (
                                <p className="text-red-500 text-sm mt-1">{errors[`teamMember${index}Name`]}</p>
                              )}
                            </div>
                            
                            <div>
                              <label className="form-label">Email *</label>
                              <input
                                type="email"
                                value={member.email}
                                onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                                className={`form-input ${errors[`teamMember${index}Email`] ? 'border-red-500' : ''}`}
                                placeholder="Member email"
                              />
                              {errors[`teamMember${index}Email`] && (
                                <p className="text-red-500 text-sm mt-1">{errors[`teamMember${index}Email`]}</p>
                              )}
                            </div>
                            
                            <div>
                              <label className="form-label">Phone *</label>
                              <input
                                type="tel"
                                value={member.phone}
                                onChange={(e) => updateTeamMember(index, 'phone', e.target.value)}
                                className={`form-input ${errors[`teamMember${index}Phone`] ? 'border-red-500' : ''}`}
                                placeholder="Member phone"
                              />
                              {errors[`teamMember${index}Phone`] && (
                                <p className="text-red-500 text-sm mt-1">{errors[`teamMember${index}Phone`]}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Information */}
                <div className="card p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <CreditCard className="w-6 h-6 mr-3" />
                    Payment Information
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="form-label">Payment Method</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="upi"
                            checked={formData.paymentMethod === 'upi'}
                            onChange={handleInputChange}
                            className="mr-3"
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">UPI</div>
                            <div className="text-sm text-gray-500">Google Pay, PhonePe, etc.</div>
                          </div>
                        </label>
                        
                        <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="netbanking"
                            checked={formData.paymentMethod === 'netbanking'}
                            onChange={handleInputChange}
                            className="mr-3"
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Net Banking</div>
                            <div className="text-sm text-gray-500">Online bank transfer</div>
                          </div>
                        </label>
                        
                        <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={formData.paymentMethod === 'card'}
                            onChange={handleInputChange}
                            className="mr-3"
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Debit/Credit Card</div>
                            <div className="text-sm text-gray-500">Visa, Mastercard, RuPay</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                            Payment Instructions
                          </h4>
                          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                            Please complete the payment of ₹{totalFee} using your preferred method and enter the transaction ID below. 
                            Payment confirmation is required to complete registration.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Transaction ID *</label>
                      <input
                        type="text"
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleInputChange}
                        className={`form-input ${errors.transactionId ? 'border-red-500' : ''}`}
                        placeholder="Enter transaction/reference ID"
                      />
                      {errors.transactionId && (
                        <p className="text-red-500 text-sm mt-1">{errors.transactionId}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="card p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Terms & Conditions
                  </h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="mt-1 mr-3"
                      />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        I agree to the <a href="/terms" className="text-primary-600 hover:underline">terms and conditions</a> of Discovery 2K25. 
                        I understand that all rules and regulations must be followed during the event.
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>
                    )}
                    
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="agreeToPrivacy"
                        checked={formData.agreeToPrivacy}
                        onChange={handleInputChange}
                        className="mt-1 mr-3"
                      />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        I consent to the collection and use of my personal information as described in the <a href="/privacy" className="text-primary-600 hover:underline">privacy policy</a>.
                      </span>
                    </label>
                    {errors.agreeToPrivacy && (
                      <p className="text-red-500 text-sm">{errors.agreeToPrivacy}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className="space-y-6">
                <div className="card p-6 sticky top-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Registration Summary
                  </h3>
                  
                  {selectedEvent ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{selectedEvent.name}</h4>
                        <p className="text-sm text-gray-500">{selectedEvent.department}</p>
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Participants:</span>
                          <span>{formData.teamMembers.length + 1}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Entry Fee:</span>
                          <span>₹{entryFee} per person</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span>₹{totalFee}</span>
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="loading-spinner mr-2"></div>
                            Submitting...
                          </div>
                        ) : (
                          'Complete Registration'
                        )}
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      Please select an event to see the summary
                    </p>
                  )}
                </div>

                {/* Contact Info */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Need Help?
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>+91 9657028810</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>discovery2k25@adcet.in</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Contact us for any registration related queries.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Registration