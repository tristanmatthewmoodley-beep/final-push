import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 123-4568"]
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["info@mseriesauto.com", "support@mseriesauto.com"]
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Address",
      details: ["123 Auto Parts Street", "Car City, CC 12345"]
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: ["Mon-Fri: 8:00 AM - 6:00 PM", "Sat-Sun: 9:00 AM - 4:00 PM"]
    }
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions about our products or need technical support? 
            We're here to help you find the right parts for your vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="input-field w-full"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="input-field w-full"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="input-field w-full"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What can we help you with?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="input-field w-full resize-none"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please provide details about your inquiry..."
                />
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              <p className="text-gray-300 mb-6">
                We're always happy to help with any questions about our products, 
                shipping, or technical support. Choose the best way to reach us:
              </p>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 text-white">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {info.title}
                      </h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-300">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="card">
              <h3 className="text-xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    Do you offer international shipping?
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Yes, we ship to over 100 countries worldwide with various shipping options.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    What's your return policy?
                  </h4>
                  <p className="text-gray-300 text-sm">
                    We offer a 30-day return policy on all unused parts in original packaging.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    Do you provide technical support?
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Yes, our technical team is available 24/7 to help with installation and compatibility questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
