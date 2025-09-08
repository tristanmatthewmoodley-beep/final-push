import { Users, Award, Clock, Globe } from 'lucide-react'

const About = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      number: "50,000+",
      label: "Happy Customers"
    },
    {
      icon: <Award className="w-8 h-8" />,
      number: "15+",
      label: "Years Experience"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      number: "24/7",
      label: "Customer Support"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      number: "100+",
      label: "Countries Served"
    }
  ]

  const team = [
    {
      name: "John Smith",
      role: "Founder & CEO",
      description: "20+ years in automotive industry"
    },
    {
      name: "Sarah Johnson",
      role: "Technical Director",
      description: "Expert in automotive engineering"
    },
    {
      name: "Mike Wilson",
      role: "Customer Success Manager",
      description: "Dedicated to customer satisfaction"
    }
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About MseriesAutoOnlineSpares
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We are passionate about providing the highest quality car parts and spares 
            to automotive enthusiasts and professionals worldwide.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4 text-white">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Founded in 2009, MseriesAutoOnlineSpares began as a small family business 
                with a simple mission: to provide car enthusiasts with access to premium 
                quality parts at competitive prices.
              </p>
              <p>
                Over the years, we've grown from a local parts supplier to a trusted 
                international brand, serving customers in over 100 countries. Our success 
                is built on three core principles: quality, reliability, and exceptional 
                customer service.
              </p>
              <p>
                Today, we work directly with leading manufacturers and suppliers to ensure 
                that every part we sell meets the highest standards of quality and performance.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                To be the world's most trusted source for automotive parts and spares, 
                providing our customers with the components they need to keep their 
                vehicles running at peak performance.
              </p>
              <p>
                We believe that every vehicle deserves the best care, whether it's a 
                daily commuter, a weekend project car, or a professional racing machine. 
                That's why we carefully curate our inventory to include only the finest 
                parts from reputable manufacturers.
              </p>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Our Values</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Quality first - Every part is thoroughly tested</li>
                <li>• Customer satisfaction - Your success is our success</li>
                <li>• Innovation - Embracing new technologies and solutions</li>
                <li>• Integrity - Honest, transparent business practices</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <div className="w-24 h-24 bg-car-light-gray rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-300 mb-2">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-car-gray rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 mb-6">
            Browse our extensive catalog of premium car parts and spares
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/products" className="btn-primary">
              Shop Now
            </a>
            <a href="/contact" className="btn-secondary">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
