// src/components/booking/BookingActionPanel.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2, Zap, X, Star } from 'lucide-react';

import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

import { 
    useCancelBooking, 
    useProcessPayment, 
    useSubmitReview 
} from '@/hooks/booking/use-booking-management'; 

import type { Booking } from '@/types/booking';
import { useAuthStore } from '@/store/auth-store';

interface BookingActionPanelProps {
  booking: Booking;
}

export default function BookingActionPanel({ booking }: BookingActionPanelProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore(); // Check if the current user is the booking owner

  const isUserBookingOwner = user?.email === booking.user.email;
  
  // Initialize mutation hooks
  const { mutate: cancel, isPending: isCancelling } = useCancelBooking();
  const { mutate: pay, isPending: isProcessingPayment } = useProcessPayment();
  // NOTE: Review should typically be done via a dedicated modal or page
  const { mutate: submitReview, isPending: isReviewing } = useSubmitReview(); 
  
  const bookingId = booking._id;

  // --- Handlers ---

  const handlePayment = () => {
    if (!window.confirm("Simulate proceeding to payment?")) return;

    pay({
      bookingId: bookingId,
      paymentMethod: 'card',
      cardDetails: { token: 'simulated_token' }
    });
  };

  const handleCancel = () => {
    const reason = prompt("Enter reason for cancellation:");
    if (reason) {
      cancel({ bookingId: bookingId, cancellationReason: reason });
    } else {
      toast.error("Cancellation requires a reason.");
    }
  };

  const handleReview = () => {
    navigate(`/bookings/${booking.bookingNumber}/review`);
  };

  // Only show the action panel if the user is the owner 
  if (!isUserBookingOwner) {
    return null;
  }
  
  let content = null;
  
  switch (booking.status) {
    case 'pending':
      content = (
        <Button 
          variant="outline" 
          onClick={handleCancel} 
          disabled={isCancelling}
          leftIcon={isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
          className="w-full border-red-500 text-red-500 hover:bg-red-50"
        >
          Cancel Booking Request
        </Button>
      );
      break;

    case 'confirmed':
      content = (
        <>
          {/* Action 1: Pay */}
          <Button 
            onClick={handlePayment} 
            disabled={isProcessingPayment}
            leftIcon={isProcessingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            className="w-full bg-primary-600 hover:bg-primary-700"
          >
            {isProcessingPayment ? 'Processing Payment...' : 'Proceed to Payment'}
          </Button>
          {/* Action 2: Cancel (often allowed until 24h before meeting) */}
          <Button 
            variant="ghost" 
            onClick={handleCancel} 
            disabled={isCancelling}
            className="w-full mt-3 text-red-500 hover:bg-red-50"
          >
            Cancel Booking
          </Button>
        </>
      );
      break;

    case 'completed': { // 🛑 FIX: Added opening brace for block scoping
      const hasReviewed = false; // Placeholder for actual check (e.g., booking.isReviewed)
      if (!hasReviewed) {
        content = (
          <Button 
            onClick={handleReview} 
            disabled={isReviewing}
            leftIcon={isReviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            Submit Review
          </Button>
        );
      } else {
        content = <p className="text-center text-sm text-green-600">Review submitted successfully.</p>;
      }
      break;
    } // 🛑 FIX: Added closing brace

    case 'cancelled':
    case 'rejected':
      content = <p className="text-center text-gray-500">No actions available for this status.</p>;
      break;

    default:
      content = <p className="text-center text-gray-500">Status: {booking.status}</p>;
  }


  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Actions</h2>
      {content}
    </Card>
  );
}