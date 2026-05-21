import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Star, DollarSign, Award, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import Button from '@/components/common/Button';
import Layout from '@/components/layout/Layout';

// Mock attorney data - replace with actual API call
const getAttorneyById = (id: string) => ({
  id,
  fullName: 'Adebayo Johnson',
  firmName: 'Johnson Tax Associates',
  location: 'Lagos, Nigeria',
  yearsOfExperience: 15,
  hourlyRate: 50000,
  rating: 4.8,
  reviewCount: 124,
  specializations: ['Corporate Tax', 'International Tax', 'Tax Planning', 'Audit Defense'],
  bio: 'Experienced tax attorney specializing in corporate and international tax law. Over 15 years of experience helping businesses navigate complex tax regulations and optimize their tax strategies.',
  education: ['LLM in Taxation - Harvard Law School', 'LLB - University of Lagos'],
  certifications: ['Chartered Tax Advisor', 'Certified Public Accountant'],
  successRate: 92,
  casesHandled: 500,
});

export default function AttorneyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  if (!id) {
    return <div>Attorney not found</div>;
  }

  const attorney = getAttorneyById(id);

  const handleHireClick = () => {
    if (isAuthenticated) {
      navigate(`/attorney/${id}/hire`);
    } else {
      navigate(`/login?redirect=/attorney/${id}`);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Back Button */}
        <div className="border-b border-gray-200">
          <div className="container mx-auto px-6 md:px-12 lg:px-16 py-6">
            <Link
              to="/find-attorney"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-light">Back to directory</span>
            </Link>
          </div>
        </div>

        {/* Attorney Profile */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                  {/* Header */}
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-light text-gray-900">
                          {attorney.fullName}
                        </h1>
                        <div className="text-xl text-primary-600 font-light">
                          {attorney.firmName}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xl font-light text-gray-900">{attorney.rating}</span>
                        <span className="text-sm text-gray-500">({attorney.reviewCount} reviews)</span>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="flex flex-wrap gap-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-5 h-5" />
                        <span className="font-light">{attorney.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-5 h-5" />
                        <span className="font-light">{attorney.yearsOfExperience} years experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-5 h-5" />
                        <span className="font-light">₦{attorney.hourlyRate.toLocaleString()}/hour</span>
                      </div>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-light text-gray-900">Specializations</h2>
                    <div className="flex flex-wrap gap-3">
                      {attorney.specializations.map((spec, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-light"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* About */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-light text-gray-900">About</h2>
                    <p className="text-lg text-gray-600 leading-relaxed font-light">
                      {attorney.bio}
                    </p>
                  </div>

                  {/* Education */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-light text-gray-900">Education</h2>
                    <ul className="space-y-3">
                      {attorney.education.map((edu, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                          <span className="text-gray-700 font-light">{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Certifications */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-light text-gray-900">Certifications</h2>
                    <ul className="space-y-3">
                      {attorney.certifications.map((cert, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                          <span className="text-gray-700 font-light">{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-8">
                    {/* Stats Card */}
                    <div className="bg-gray-50 border border-gray-200 p-8">
                      <div className="space-y-6">
                        <div>
                          <div className="text-4xl font-light text-gray-900 mb-1">
                            {attorney.successRate}%
                          </div>
                          <div className="text-sm text-gray-600 font-light">Success Rate</div>
                        </div>
                        <div className="h-px bg-gray-200"></div>
                        <div>
                          <div className="text-4xl font-light text-gray-900 mb-1">
                            {attorney.casesHandled}+
                          </div>
                          <div className="text-sm text-gray-600 font-light">Cases Handled</div>
                        </div>
                      </div>
                    </div>

                    {/* Hire Button */}
                    <div className="space-y-4">
                      {!isAuthenticated && (
                        <div className="p-4 bg-blue-50 border border-blue-200 text-sm text-blue-800 font-light">
                          Please sign in to hire this attorney
                        </div>
                      )}
                      
                      <Button
                        onClick={handleHireClick}
                        size="lg"
                        className="w-full bg-secondary-900 hover:bg-secondary-800 text-white group"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {isAuthenticated ? 'Hire Attorney' : 'Sign in to Hire'}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>

                      <div className="text-center">
                        <div className="text-2xl font-light text-gray-900">
                          ₦{attorney.hourlyRate.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 font-light">per hour</div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="pt-8 border-t border-gray-200">
                      <div className="text-sm text-gray-600 font-light space-y-2">
                        <p>Response time: Within 24 hours</p>
                        <p>Languages: English, Yoruba</p>
                        <p>Availability: Mon-Fri, 9 AM - 6 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}