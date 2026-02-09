import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const steps = [
  {
    number: '01',
    title: 'Create Account',
    items: ['Sign up with your email', 'Verify your identity'],
  },
  {
    number: '02',
    title: 'Set Up Your Profile',
    items: ['Complete your profile with basic info', 'Link your bank accounts for transactions'],
  },
  {
    number: '03',
    title: 'Explore Services',
    items: ['Browse legal and financial services', 'Choose services that fit your needs'],
  },
  {
    number: '04',
    title: 'Book an Expert',
    items: ['Select a verified attorney or accountant', 'Schedule a consultation'],
  },
  {
    number: '05',
    title: 'Start Managing',
    items: ['Access documents and consultations in one place', 'Track progress in real time'],
  },
];

const approach = [
  {
    title: 'Find your attorney',
    description: 'Browse verified tax attorneys based on your specific needs and budget. Compare profiles, reviews, and expertise.',
  },
  {
    title: 'Book consultation',
    description: 'Schedule a meeting at your convenience. Most attorneys offer free initial consultations to discuss your case.',
  },
  {
    title: 'Get expert help',
    description: 'Work directly with your attorney to resolve your tax issues or plan your tax strategy effectively.',
  },
  {
    title: 'Stay compliant',
    description: 'Receive ongoing support and guidance to ensure you remain compliant with all tax regulations.',
  },
];

export default function ServicesPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="py-20 sm:py-28 md:py-36 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-gray-900 leading-tight">
              Find the right attorney
              <br />
              <span className="text-primary-600">for your needs</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Connect with verified tax attorneys who specialize in helping businesses 
              and individuals with all their tax needs.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                How to get started
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Get up and running in five simple steps
              </p>
            </div>

            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-12"
            >
              {steps.map((step, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-white rounded-xl p-8 sm:p-10 shadow-sm border border-gray-100 h-full">
                    <div className="text-5xl font-bold text-primary-100 mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <ul className="space-y-2">
                      {step.items.map((item, idx) => (
                        <li key={idx} className="text-sm sm:text-base text-gray-600 flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Simple steps to
                <br />
                <span className="text-primary-600">get expert help</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200 rounded-2xl overflow-hidden">
                {approach.map((step, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 sm:p-8 md:p-10 hover:bg-gray-50 transition-colors duration-300"
                  >
                    <div className="space-y-4">
                      <div className="text-5xl sm:text-6xl font-bold text-gray-100 leading-none">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {step.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden w-full lg:block overflow-hidden">
                <img
                  src="/images/image1-copy.png"
                  alt="Attorney consultation"
                  className="w-full h-full  object-cover object-fit"
                  onError={(e) => {
                    e.currentTarget.parentElement!.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}