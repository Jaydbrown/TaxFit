import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/common/Button';

const trustedCompanies = [
  'Microsoft', 'JPMorgan Chase', 'Google', 'Goldman Sachs', 'Amazon', 'BlackRock'
];

const testimonials = [
  {
    quote: "Working with Tax-FIT transformed how we approach our global tax strategy. Their team saved us $47 million in the first year alone while ensuring complete compliance across 89 jurisdictions. The platform is remarkably intuitive, but it's the human expertise behind it that makes all the difference.",
    author: "Jennifer Martinez",
    role: "Chief Financial Officer",
    company: "Fortune 100 Technology Corporation",
    results: "Saved $47M annually"
  },
  {
    quote: "As a multi-national enterprise, we needed partners who truly understood the complexity of international tax law. Tax-FIT's combination of sophisticated technology and world-class tax attorneys gave us the confidence to expand into 23 new markets this year.",
    author: "David Chen",
    role: "Global Tax Director", 
    company: "Manufacturing Conglomerate",
    results: "Expanded to 23 markets"
  },
  {
    quote: "The level of personalized service is exceptional. Every interaction feels like we're their only client, yet they're managing our entire tax portfolio across multiple entities. This is what enterprise service should look like.",
    author: "Amara Okonkwo",
    role: "Managing Director",
    company: "Leading Investment Bank",
    results: "100% compliance rate"
  },
];

const caseStudies = [
  {
    title: "Global Technology Leader",
    industry: "Technology & SaaS",
    challenge: "Managing tax compliance across 150+ countries while optimizing for growth",
    result: "42% reduction in effective tax rate, $89M saved annually",
    metric: "$89M",
    label: "Annual Savings"
  },
  {
    title: "International Banking Group",
    industry: "Financial Services",
    challenge: "Navigating complex transfer pricing regulations across multiple jurisdictions",
    result: "Zero compliance issues, 18-month audit successfully resolved",
    metric: "100%",
    label: "Compliance Rate"
  },
  {
    title: "Manufacturing Enterprise",
    industry: "Industrial & Manufacturing",
    challenge: "Restructuring operations for tax efficiency while maintaining operational excellence",
    result: "Optimized structure saved $34M while reducing administrative burden by 60%",
    metric: "$34M",
    label: "Cost Reduction"
  },
];

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      {/* Hero Section - Museum Quality */}
      <section className="relative min-h-[90vh] flex items-center bg-white">
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle architectural lines */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-0 left-1/4 w-px h-full bg-gray-900"></div>
            <div className="absolute top-0 left-1/2 w-px h-full bg-gray-900"></div>
            <div className="absolute top-0 left-3/4 w-px h-full bg-gray-900"></div>
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-7 space-y-10">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-px w-16 bg-gray-900"></div>
                    <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-light">
                      Since 2015
                    </span>
                  </div>
                  <h1 className="space-y-4">
                    <div className="text-6xl md:text-7xl lg:text-8xl font-extralight text-gray-900 tracking-tight leading-[0.9]">
                      Tax strategy
                    </div>
                    <div className="text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 tracking-tight leading-[0.9]">
                      <span className="italic">reimagined</span>
                    </div>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-2xl">
                    We partner with the world's most discerning enterprises to craft 
                    tax strategies that are as sophisticated as they are effective.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <button 
                    onClick={() => navigate('/register')}
                    className="group relative px-8 py-4 bg-gray-900 text-white overflow-hidden transition-all duration-500 hover:px-10"
                  >
                    <span className="relative z-10 text-sm tracking-wider uppercase font-light flex items-center gap-3">
                      Begin consultation
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gray-800 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                  </button>
                  
                  <Link 
                    to="/about"
                    className="px-8 py-4 text-sm tracking-wider uppercase font-light text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-3 group"
                  >
                    Our story
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                <div className="flex items-center gap-12 pt-8 border-t border-gray-200">
                  <div>
                    <div className="text-3xl font-light text-gray-900 mb-1">150,000+</div>
                    <div className="text-xs uppercase tracking-wider text-gray-500">Global clients</div>
                  </div>
                  <div>
                    <div className="text-3xl font-light text-gray-900 mb-1">$250B+</div>
                    <div className="text-xs uppercase tracking-wider text-gray-500">Tax savings</div>
                  </div>
                  <div>
                    <div className="text-3xl font-light text-gray-900 mb-1">150+</div>
                    <div className="text-xs uppercase tracking-wider text-gray-500">Countries</div>
                  </div>
                </div>
              </div>

              {/* Right Visual Element */}
              <div className="lg:col-span-5">
                <div className="relative">
                  {/* Main image placeholder */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 via-gray-50 to-white relative overflow-hidden">
                    {/* Geometric overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-8 p-12">
                        <div className="w-1 h-32 bg-gray-900 mx-auto"></div>
                        <div className="text-sm uppercase tracking-[0.3em] text-gray-400">
                          Professional imagery
                        </div>
                        <div className="w-1 h-32 bg-gray-900 mx-auto"></div>
                      </div>
                    </div>
                  </div>

                  {/* Floating credential */}
                  <div className="absolute -bottom-8 -left-8 bg-white p-8 shadow-2xl">
                    <div className="space-y-3">
                      <div className="text-sm uppercase tracking-wider text-gray-500">Certified</div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-600">SOC 2 Type II</div>
                        <div className="text-xs text-gray-600">ISO 27001</div>
                        <div className="text-xs text-gray-600">GDPR Compliant</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By - Ultra Minimal */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-16">
              Trusted Globally
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {trustedCompanies.map((company, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg font-light text-gray-400 hover:text-gray-900 transition-colors duration-300">
                    {company}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

  
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="aspect-[4/5] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
                    <div className="absolute inset-0 flex items-center justify-center p-16">
                      <div className="text-center space-y-8">
                        <div className="text-white/20 text-8xl font-extralight">T</div>
                        <div className="h-px w-24 bg-white/20 mx-auto"></div>
                        <div className="text-white/40 text-xs uppercase tracking-[0.3em]">
                          Excellence in Practice
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-12 -right-12 bg-white p-10 shadow-2xl">
                    <div className="text-6xl font-extralight text-gray-900 mb-3">99.9<span className="text-3xl">%</span></div>
                    <div className="text-xs uppercase tracking-wider text-gray-500">Client Satisfaction</div>
                    <div className="text-xs text-gray-400 mt-2">Since 2015</div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-px w-12 bg-gray-900"></div>
                    <span className="text-xs uppercase tracking-[0.3em] text-gray-500">Our Philosophy</span>
                  </div>

                  <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 leading-tight">
                    Excellence in
                    <br />
                    <span className="italic font-light">tax advisory</span>
                  </h2>
                </div>

                <div className="space-y-8 text-lg text-gray-600 leading-relaxed font-light">
                  <p>
                    For over a decade, we have dedicated ourselves to one singular pursuit: 
                    delivering unparalleled tax advisory services to the world's most sophisticated enterprises.
                  </p>
                  <p>
                    Our approach transcends traditional consulting. We forge lasting partnerships 
                    built on deep expertise, strategic foresight, and an unwavering commitment 
                    to your financial success.
                  </p>
                  <p>
                    Every client receives the full attention of our most senior tax attorneys—professionals 
                    who don't just understand tax law, but the intricate dynamics of your business.
                  </p>
                </div>

                <Link 
                  to="/about"
                  className="inline-flex items-center gap-3 text-sm uppercase tracking-wider text-gray-900 hover:text-gray-600 transition-colors group"
                >
                  Discover our approach
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services - Architectural */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-gray-900"></div>
                <span className="text-xs uppercase tracking-[0.3em] text-gray-500">Services</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 max-w-3xl leading-tight">
                Comprehensive solutions for
                <span className="italic font-light"> discerning enterprises</span>
              </h2>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-300">
              {/* Service 1 */}
              <div className="bg-white p-12 group hover:bg-gray-900 transition-all duration-500">
                <div className="space-y-8">
                  <div className="text-[120px] font-extralight text-gray-200 group-hover:text-white/20 transition-colors leading-none">
                    01
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-light text-gray-900 group-hover:text-white transition-colors">
                      Strategic Planning
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-300 leading-relaxed transition-colors">
                      Proactive strategies meticulously crafted to align with your business objectives 
                      and maximize efficiency across all jurisdictions.
                    </p>
                  </div>
                  <Link 
                    to="/services"
                    className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-gray-900 group-hover:text-white transition-colors"
                  >
                    Explore
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Service 2 */}
              <div className="bg-white p-12 group hover:bg-gray-900 transition-all duration-500">
                <div className="space-y-8">
                  <div className="text-[120px] font-extralight text-gray-200 group-hover:text-white/20 transition-colors leading-none">
                    02
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-light text-gray-900 group-hover:text-white transition-colors">
                      Compliance & Filing
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-300 leading-relaxed transition-colors">
                      Meticulous attention to every detail ensures accuracy and timeliness 
                      across all your filing obligations.
                    </p>
                  </div>
                  <Link 
                    to="/services"
                    className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-gray-900 group-hover:text-white transition-colors"
                  >
                    Explore
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Service 3 */}
              <div className="bg-white p-12 group hover:bg-gray-900 transition-all duration-500">
                <div className="space-y-8">
                  <div className="text-[120px] font-extralight text-gray-200 group-hover:text-white/20 transition-colors leading-none">
                    03
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-light text-gray-900 group-hover:text-white transition-colors">
                      Audit Defense
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-300 leading-relaxed transition-colors">
                      Expert representation and strategic defense when you face 
                      scrutiny from tax authorities.
                    </p>
                  </div>
                  <Link 
                    to="/services"
                    className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-gray-900 group-hover:text-white transition-colors"
                  >
                    Explore
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies - Editorial */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-24 text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-12 bg-gray-900"></div>
                <span className="text-xs uppercase tracking-[0.3em] text-gray-500">Case Studies</span>
                <div className="h-px w-12 bg-gray-900"></div>
              </div>
              <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 leading-tight">
                Results that speak for
                <span className="italic font-light"> themselves</span>
              </h2>
            </div>

            <div className="space-y-20">
              {caseStudies.map((study, index) => (
                <div key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 border-b border-gray-200 last:border-0">
                  <div className="lg:col-span-3">
                    <div className="space-y-3">
                      <div className="text-xs uppercase tracking-wider text-gray-400">{study.industry}</div>
                      <div className="text-6xl font-extralight text-gray-900">{study.metric}</div>
                      <div className="text-sm text-gray-500">{study.label}</div>
                    </div>
                  </div>
                  <div className="lg:col-span-9 space-y-6">
                    <h3 className="text-3xl font-light text-gray-900">{study.title}</h3>
                    <div className="space-y-4 text-gray-600 leading-relaxed">
                      <p>
                        <span className="text-gray-900 font-medium">Challenge: </span>
                        {study.challenge}
                      </p>
                      <p>
                        <span className="text-gray-900 font-medium">Result: </span>
                        {study.result}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-20">
              <Link 
                to="/about"
                className="inline-flex items-center gap-3 text-sm uppercase tracking-wider text-gray-900 hover:text-gray-600 transition-colors group"
              >
                View all case studies
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-32 bg-gray-900 text-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-16">
              <blockquote className="text-3xl md:text-4xl lg:text-5xl font-extralight leading-relaxed">
                "{testimonials[activeTestimonial].quote}"
              </blockquote>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between pt-12 border-t border-white/10 gap-8">
                <div className="space-y-2">
                  <div className="text-xl font-light">{testimonials[activeTestimonial].author}</div>
                  <div className="text-sm text-gray-400">{testimonials[activeTestimonial].role}</div>
                  <div className="text-xs text-gray-500">{testimonials[activeTestimonial].company}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-light text-primary-400">{testimonials[activeTestimonial].results}</div>
                </div>
              </div>

              <div className="flex gap-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-px transition-all ${
                      index === activeTestimonial 
                        ? 'w-16 bg-white' 
                        : 'w-8 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Sophisticated */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-8">
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-gray-900"></div>
                <span className="text-xs uppercase tracking-[0.3em] text-gray-500">Begin Your Journey</span>
                <div className="h-px w-12 bg-gray-900"></div>
              </div>

              <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-gray-900 leading-tight">
                Let us craft your
                <br />
                <span className="italic font-light">tax strategy</span>
              </h2>

              <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                Schedule a private consultation with our senior tax advisors to explore 
                how we can elevate your tax operations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => navigate('/register')}
                className="group relative px-10 py-5 bg-gray-900 text-white overflow-hidden transition-all duration-500 hover:px-12"
              >
                <span className="relative z-10 text-sm tracking-wider uppercase font-light flex items-center gap-3">
                  Schedule consultation
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gray-800 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
              
              <button 
                onClick={() => navigate('/find-attorney')}
                className="px-10 py-5 text-sm tracking-wider uppercase font-light text-gray-900 hover:text-gray-600 transition-colors border border-gray-300 hover:border-gray-900"
              >
                Browse attorneys
              </button>
            </div>

            <p className="text-xs uppercase tracking-wider text-gray-400">
              Complimentary consultation • Senior advisors • 24-hour response
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}