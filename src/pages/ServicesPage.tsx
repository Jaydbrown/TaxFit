import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    number: '01',
    title: 'Strategic Tax Planning',
    description: 'Comprehensive tax strategies meticulously aligned with your business objectives. We architect solutions that maximize efficiency while maintaining complete regulatory compliance across all jurisdictions.',
    features: [
      'Multi-year tax forecasting and scenario modeling',
      'Cross-border optimization strategies',
      'Investment structure analysis',
      'Executive compensation planning',
      'Succession and estate planning',
      'Merger and acquisition tax due diligence'
    ],
    results: 'Average 35% reduction in effective tax rate'
  },
  {
    number: '02',
    title: 'Compliance & Filing',
    description: 'Meticulous attention to every regulatory requirement ensures accuracy, timeliness, and peace of mind. Our team manages the complexity so you can focus on your business.',
    features: [
      'Corporate income tax returns',
      'International tax compliance',
      'Transfer pricing documentation',
      'Quarterly estimated tax payments',
      'Tax clearance certificates',
      'Regulatory reporting and disclosures'
    ],
    results: '99.9% accuracy rate, zero late filings'
  },
  {
    number: '03',
    title: 'Audit Defense & Representation',
    description: 'Expert advocacy when tax authorities question your returns. We provide strategic representation backed by deep technical knowledge and decades of experience.',
    features: [
      'Pre-audit risk assessment',
      'Complete audit representation',
      'Documentation preparation and review',
      'Negotiation with tax authorities',
      'Appeals and dispute resolution',
      'Settlement optimization'
    ],
    results: '92% favorable resolution rate'
  },
  {
    number: '04',
    title: 'International Tax Services',
    description: 'Navigate the complexities of global tax compliance with confidence. Our international specialists ensure seamless operations across borders.',
    features: [
      'Cross-border transaction structuring',
      'Permanent establishment analysis',
      'Foreign tax credit optimization',
      'Repatriation strategies',
      'Treaty interpretation and application',
      'Global mobility and expatriate taxation'
    ],
    results: 'Supporting operations in 150+ countries'
  },
  {
    number: '05',
    title: 'Business Restructuring',
    description: 'Transform your organizational structure for optimal tax efficiency. We design and implement restructuring strategies that reduce tax burden while enhancing operational effectiveness.',
    features: [
      'Entity structure optimization',
      'Spin-offs and separations',
      'Asset reallocation strategies',
      'Debt restructuring',
      'Tax-free reorganizations',
      'Post-merger integration'
    ],
    results: 'Average $15M+ in annual savings'
  },
  {
    number: '06',
    title: 'Advisory & Training',
    description: 'Empower your team with deep tax knowledge. Our customized training programs and ongoing advisory services keep you ahead of regulatory changes.',
    features: [
      'Executive tax briefings',
      'Customized training programs',
      'Tax law update sessions',
      'Industry-specific workshops',
      'Best practices documentation',
      'Dedicated advisory support'
    ],
    results: '1,000+ professionals trained annually'
  }
];

const approach = [
  {
    title: 'Discovery',
    description: 'We begin with comprehensive analysis of your business, industry, and unique challenges. Every engagement starts with deep understanding.'
  },
  {
    title: 'Strategy',
    description: 'Our senior advisors craft bespoke solutions tailored to your specific objectives. Each strategy is meticulously designed and tested.'
  },
  {
    title: 'Implementation',
    description: 'Seamless execution with minimal disruption. We manage every detail while keeping you informed at every stage.'
  },
  {
    title: 'Optimization',
    description: 'Continuous monitoring and refinement ensure your strategy evolves with your business and regulatory landscape.'
  }
];

export default function ServicesPage() {
  return (
    <Layout>
      <section className="relative py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-12">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-px w-16 bg-gray-900"></div>
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-light">
                    Services
                  </span>
                </div>

                <h1 className="text-6xl md:text-7xl lg:text-8xl font-extralight text-gray-900 tracking-tight leading-[0.95]">
                  Comprehensive tax
                  <br />
                  <span className="italic font-light">solutions</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-3xl">
                  From strategic planning to audit defense, we deliver end-to-end tax services 
                  designed for the world's most sophisticated enterprises.
                </p>
              </div>

              <div className="flex items-center gap-12 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-light text-gray-900 mb-1">Six</div>
                  <div className="text-xs uppercase tracking-wider text-gray-500">Core services</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-gray-900 mb-1">150+</div>
                  <div className="text-xs uppercase tracking-wider text-gray-500">Countries</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-gray-900 mb-1">24/7</div>
                  <div className="text-xs uppercase tracking-wider text-gray-500">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto space-y-24">
            {services.map((service, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-24 border-b border-gray-200 last:border-0">
                <div className="lg:col-span-2">
                  <div className="text-[140px] font-extralight text-gray-200 leading-none">
                    {service.number}
                  </div>
                </div>
                <div className="lg:col-span-10 space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-light text-gray-900">
                      {service.title}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                      {service.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="h-px w-6 bg-gray-900 mt-3 flex-shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Results */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="text-sm uppercase tracking-wider text-gray-500 mb-2">Results</div>
                    <div className="text-xl font-light text-gray-900">{service.results}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-gray-900"></div>
                <span className="text-xs uppercase tracking-[0.3em] text-gray-500">Our Approach</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 leading-tight">
                A methodology refined
                <br />
                <span className="italic font-light">over a decade</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-300">
              {approach.map((step, index) => (
                <div key={index} className="bg-white p-12 hover:bg-gray-50 transition-colors duration-300">
                  <div className="space-y-6">
                    <div className="text-7xl font-extralight text-gray-200 leading-none">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-light text-gray-900">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-8">
              <h2 className="text-5xl md:text-6xl font-extralight text-gray-900 leading-tight">
                Let's discuss your
                <br />
                <span className="italic font-light">specific needs</span>
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                Schedule a consultation to explore how our services can be tailored to your unique requirements.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/register"
                className="group relative px-10 py-5 bg-gray-900 text-white overflow-hidden transition-all duration-500 hover:px-12 inline-block"
              >
                <span className="relative z-10 text-sm tracking-wider uppercase font-light flex items-center justify-center gap-3">
                  Schedule consultation
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gray-800 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              </Link>
              
              <Link 
                to="/find-attorney"
                className="px-10 py-5 text-sm tracking-wider uppercase font-light text-gray-900 hover:text-gray-600 transition-colors border border-gray-300 hover:border-gray-900 inline-block text-center"
              >
                Browse attorneys
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}