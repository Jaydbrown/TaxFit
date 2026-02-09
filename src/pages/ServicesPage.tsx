import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ArrowRight, ArrowLeft, ChevronDown, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';

const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up with your email, verify your identity, and choose your account type. It takes less than two minutes to get started on Tax-FIT.',
    accent: 'from-blue-500 to-blue-600',
  },
  {
    number: '02',
    title: 'Build Your Profile',
    description: 'Complete your profile with basic information, link your bank accounts for seamless transactions, and upload any relevant tax documents.',
    accent: 'from-emerald-500 to-emerald-600',
  },
  {
    number: '03',
    title: 'Explore Our Services',
    description: 'Browse through our comprehensive range of legal and financial services. Filter by specialization, compare pricing, and read verified client reviews.',
    accent: 'from-violet-500 to-violet-600',
  },
  {
    number: '04',
    title: 'Book Your Expert',
    description: 'Select a verified attorney or accountant that fits your needs. Schedule a consultation at your convenience and get a free initial case assessment.',
    accent: 'from-amber-500 to-amber-600',
  },
  {
    number: '05',
    title: 'Start Managing Your Taxes',
    description: 'Access all your documents and consultations in one place. Track your progress in real time and receive ongoing expert support and compliance alerts.',
    accent: 'from-rose-500 to-rose-600',
  },
];

const services = [
  {
    title: 'Tax Planning',
    description: 'Strategic tax planning to minimize your liability and maximize savings. Our attorneys help you structure your finances for optimal tax efficiency.',
    features: ['Personal tax optimization', 'Business tax structuring', 'Investment tax planning', 'Year-round advisory'],
  },
  {
    title: 'Tax Compliance',
    description: 'Stay compliant with all federal and state tax regulations. We handle filings, deadlines, and ensure you never face penalties.',
    features: ['Annual tax filing', 'VAT compliance', 'Payroll tax management', 'Regulatory updates'],
  },
  {
    title: 'Audit Defense',
    description: 'Expert representation during tax audits. Our attorneys protect your interests and ensure fair treatment throughout the process.',
    features: ['Audit preparation', 'FIRS representation', 'Appeal handling', 'Settlement negotiation'],
  },
  {
    title: 'Business Advisory',
    description: 'Comprehensive financial advisory for businesses of all sizes. From startups to enterprises, we help you grow sustainably.',
    features: ['Company formation', 'M&A tax advisory', 'International tax', 'Transfer pricing'],
  },
  {
    title: 'International Tax',
    description: 'Navigate complex international tax laws with confidence. Cross-border transactions, expatriate taxes, and global compliance.',
    features: ['Cross-border planning', 'Treaty benefits', 'Foreign tax credits', 'Expatriate taxation'],
  },
  {
    title: 'Estate Planning',
    description: 'Protect your wealth and ensure smooth transfer to the next generation. Tax-efficient estate and succession planning.',
    features: ['Will & trust planning', 'Inheritance tax', 'Succession planning', 'Charitable giving'],
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

const testimonials = [
  {
    quote: "Tax-FIT connected us with the perfect attorney for our complex tax issues. Their expertise saved us over ₦15M in potential penalties.",
    author: "Jennifer Martinez",
    role: "CFO, Tech Startup",
    rating: 5,
  },
  {
    quote: "Finding a qualified tax attorney through Tax-FIT was seamless. The platform made it easy to compare expertise and book consultations instantly.",
    author: "David Chen",
    role: "Business Owner",
    rating: 5,
  },
  {
    quote: "The attorneys on Tax-FIT are top-tier professionals. They handled our audit defense with exceptional skill and saved our company millions.",
    author: "Amara Okonkwo",
    role: "Managing Director",
    rating: 5,
  },
];

const faqs = [
  {
    question: 'How do I find the right attorney for my needs?',
    answer: 'Use our search and filter tools to browse attorneys by specialization, location, experience, and ratings. Each attorney profile includes their expertise, reviews from past clients, and consultation fees so you can make an informed decision.',
  },
  {
    question: 'What does an initial consultation include?',
    answer: 'Most attorneys on Tax-FIT offer a free or low-cost initial consultation where they assess your situation, explain your options, and provide a roadmap for resolving your tax issues. This is a no-obligation meeting to help you decide if the attorney is the right fit.',
  },
  {
    question: 'Are the attorneys on Tax-FIT verified?',
    answer: 'Yes. Every attorney on our platform goes through a rigorous verification process. We verify their Nigerian Bar Association membership, practicing license, educational credentials, and professional history before they can accept clients.',
  },
  {
    question: 'How much does it cost to use Tax-FIT?',
    answer: 'Creating an account and browsing attorneys is completely free. You only pay when you book a consultation or hire an attorney. Fees vary by attorney and are clearly displayed on their profiles so there are no surprises.',
  },
  {
    question: 'Can I switch attorneys if I am not satisfied?',
    answer: 'Absolutely. You are never locked in. If you feel your current attorney is not the right fit, you can browse and connect with a different attorney at any time. Your satisfaction is our priority.',
  },
];

export default function ServicesPage() {
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperType | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout>
      <section className="relative min-h-[90vh] flex items-center text-white overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/public/attorney.png"
        >
          <source src="public/images/attorney.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
          <div className="max-w-3xl space-y-7">

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight">
              Your Tax
              <br />
              Problems
              <br />
              Deserve Real
              <br />
              <span className="text-primary-400">Expertise.</span>
            </h1>

            <p className="text-xl sm:text-2xl text-white/80 leading-relaxed max-w-xl font-medium">
              Whether you're filing returns or navigating complex compliance,
              we match you with <span className="text-white font-bold">verified attorneys</span> who 
              understand Nigerian tax law.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Comprehensive Legal Services
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                From tax planning to international compliance, our network of attorneys covers every aspect of tax law.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group p-6 sm:p-8 rounded-2xl border border-gray-100 hover:border-primary-200 bg-white hover:bg-primary-50/30 transition-all duration-300 hover:shadow-lg"
                >
                  <h3 className="text-xl font-black text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12 sm:mb-16">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
                  How It Works
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-xl">
                  Five simple steps to get matched with the right tax professional
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-600 hover:text-primary-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-600 hover:text-primary-600 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pl-4 sm:pl-6 md:pl-12 lg:pl-16 xl:pl-[calc((100vw-1280px)/2+64px)]">
          <Swiper
            modules={[FreeMode, Mousewheel]}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            spaceBetween={24}
            slidesPerView="auto"
            freeMode={{
              enabled: true,
              sticky: false,
              momentumBounce: true,
              momentumRatio: 0.8,
            }}
            mousewheel={{ forceToAxis: true }}
            grabCursor={true}
            className="!overflow-visible"
          >
            {steps.map((step, index) => (
              <SwiperSlide key={index} style={{ width: 'auto' }}>
                <div className="h-[8vh] sm:h-[500px] md:w-[580px] group select-none">
                  <div className="bg-white overflow-hidden shadow-sm border border-gray-100 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className={`h-2 bg-gradient-to-r ${step.accent}`} />
                    <div className="p-8 sm:p-10 md:p-12 flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
                      <span className="text-6xl sm:text-7xl md:text-8xl font-black text-gray-100 leading-none shrink-0">
                        {step.number}
                      </span>
                      <div className="space-y-3">
                        <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                          {step.title}
                        </h3>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <SwiperSlide style={{ width: '40px' }}>
              <div className="w-10" />
            </SwiperSlide>
          </Swiper>

          <div className="flex sm:hidden items-center gap-3 mt-6 px-4">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-400 ml-2 font-medium">Drag to explore →</span>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                Simple Steps To
                <br />
                <span className="text-primary-600">Get Expert Help</span>
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
                      <div className="text-5xl sm:text-6xl font-black text-gray-100 leading-none">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900">{step.title}</h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden lg:block rounded-2xl overflow-hidden">
                <img
                  src="/images/image1-copy.png"
                  alt="Attorney consultation"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.style.background = 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #C7D2FE 100%)';
                      e.currentTarget.style.display = 'none';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
                What Our Clients Say
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 text-sm sm:text-base">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t border-gray-100 pt-5">
                    <p className="font-bold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">FAQ</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Everything you need to know about using Tax-FIT
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden transition-colors hover:border-gray-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                  >
                    <span className="font-bold text-gray-900 pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-200 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}