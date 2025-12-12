import React from 'react';
import { TrendingUp, Scale, Handshake, Users, ArrowRight } from 'lucide-react';
import Card from '@/components/common/Card';

const benefits = [
  {
    id: 1,
    title: 'Development',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    icon: TrendingUp,
  },
  {
    id: 2,
    title: 'Scaling',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    icon: Scale,
  },
  {
    id: 3,
    title: 'Improved Sales',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
    icon: Handshake,
  },
  {
    id: 4,
    title: 'Scaling',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop',
    icon: TrendingUp,
  },
  {
    id: 5,
    title: 'Loan',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
    icon: TrendingUp,
  },
  {
    id: 6,
    title: 'Social Scaling',
    image: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=400&h=300&fit=crop',
    icon: Users,
  },
  {
    id: 7,
    title: 'Scaling',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop',
    icon: Scale,
  },
  {
    id: 8,
    title: 'Good customer Service',
    image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=300&fit=crop',
    icon: Handshake,
  },
];

export default function BusinessBenefitsSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What a Tax Relieved Business Enjoy
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            
            return (
              <Card
                key={benefit.id}
                padding="none"
                hover
                className="group cursor-pointer overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      {benefit.title}
                    </h3>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button className="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium text-lg transition-colors group">
            More Categories
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}