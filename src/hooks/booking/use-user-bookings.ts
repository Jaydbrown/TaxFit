import { useQuery } from '@tanstack/react-query';
// import apiClient from '@/lib/api-client'; // Assume this exists

export interface Booking {
    id: string;
    bookingNumber: string;
    attorneyName: string;
    attorneyId: string;
    date: string; // ISO date string
    time: string; // "HH:MM AM/PM"
    status: 'Confirmed' | 'Pending' | 'Canceled' | 'Completed';
    serviceType: string;
}

/**
 * Hook to fetch all bookings for the authenticated user.
 */
export function useUserBookings() {
    return useQuery<Booking[], any>({
        queryKey: ['userBookings'],
        queryFn: async () => {
            // --- Mock Data Simulation ---
            await new Promise(resolve => setTimeout(resolve, 800)); 
            
            return [
                {
                    id: 'bkg-001',
                    bookingNumber: 'TXF-38491',
                    attorneyName: 'Aisha Lawal',
                    attorneyId: 'att-123',
                    date: '2026-01-10',
                    time: '10:00 AM',
                    status: 'Confirmed',
                    serviceType: 'Tax Audit Defense',
                },
                {
                    id: 'bkg-002',
                    bookingNumber: 'TXF-38490',
                    attorneyName: 'David Nwanne',
                    attorneyId: 'att-456',
                    date: '2025-12-28',
                    time: '02:30 PM',
                    status: 'Pending',
                    serviceType: 'International Tax Planning',
                },
                {
                    id: 'bkg-003',
                    bookingNumber: 'TXF-38489',
                    attorneyName: 'Jennifer Martinez',
                    attorneyId: 'att-789',
                    date: '2025-11-05',
                    time: '09:00 AM',
                    status: 'Completed',
                    serviceType: 'VAT Compliance Review',
                },
                {
                    id: 'bkg-004',
                    bookingNumber: 'TXF-38488',
                    attorneyName: 'Aisha Lawal',
                    attorneyId: 'att-123',
                    date: '2025-10-15',
                    time: '11:00 AM',
                    status: 'Canceled',
                    serviceType: 'Initial Consultation',
                },
            ] as Booking[];
            // --- End Mock Data ---
        },
        staleTime: 5 * 60 * 1000, 
    });
}