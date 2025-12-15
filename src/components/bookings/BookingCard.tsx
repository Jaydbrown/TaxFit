// src/components/booking/BookingCard.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, DollarSign, Video, Calendar, ArrowRight } from 'lucide-react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { formatCurrency, formatDate, formatTime } from '@/utils/helpers';
import type { Booking } from '@/types/booking'; // The API Booking schema
import Button from '../common/Button';

interface BookingCardProps {
  booking: Booking;
}

const statusVariants: { [key: string]: 'warning' | 'success' | 'danger' | 'neutral' } = {
  pending: 'warning',
  confirmed: 'success',
  completed: 'neutral',
  cancelled: 'danger',
  rejected: 'danger',
};

function BookingCard({ booking }: BookingCardProps) {
  const navigate = useNavigate();

  // Handler for clicking the entire card area
  const handleCardClick = () => {
    navigate(`/bookings/${booking._id}`);
  };
  
  // Handler for clicking the specific button
  const handleButtonDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // CRITICAL: Prevents the click from bubbling up to handleCardClick
    navigate(`/bookings/${booking._id}`);
  };
  
  const attorneyName = booking.attorney?.fullName || 'Attorney Unavailable';

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Booking #{booking.bookingNumber}
        </h3>
        <Badge variant={statusVariants[booking.status] || 'neutral'} className="capitalize">
          {booking.status}
        </Badge>
      </div>

      <div className="space-y-3 text-sm text-gray-600 border-b pb-4 mb-4">
        <InfoLine icon={Calendar} label="Date" value={formatDate(booking.bookingDate)} />
        <InfoLine icon={Clock} label="Time / Duration" value={`${formatTime(booking.bookingDate)} (${booking.duration} min)`} />
        <InfoLine icon={DollarSign} label="Amount" value={formatCurrency(booking.amount)} />
        <InfoLine icon={Video} label="Mode" value={booking.consultationMode.replace('_', ' ')} capitalize />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium text-gray-900">
          With: {attorneyName}
        </div>
        <Button size="sm" variant="link" onClick={handleButtonDetailsClick}>
          View Details <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Card>
  );
}

// Reusable component for displaying an item of information
interface InfoLineProps {
  icon: React.ElementType;
  label: string;
  value: string;
  capitalize?: boolean;
}

function InfoLine({ icon: Icon, label, value, capitalize = false }: InfoLineProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-primary-500 flex-shrink-0" />
      <span className="font-medium text-gray-500">{label}:</span>
      <span className={`text-gray-900 ${capitalize ? 'capitalize' : ''}`}>
        {value}
      </span>
    </div>
  );
}

export default BookingCard;