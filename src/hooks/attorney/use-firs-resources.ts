import { useQuery } from '@tanstack/react-query';
// Assume apiClient and types are defined elsewhere
import apiClient from '@/lib/api-client';
// import { ApiError, ApiResponse } from '@/types'; 

// --- Type Definitions ---

export interface FirsUpdate {
    id: string;
    title: string;
    date: string; // ISO 8601 date string
    source: 'FIRS' | 'Legislation' | 'Circular';
    url: string;
    isNew: boolean;
    imageUrl?: string; // Optional field for list/detail
    content?: string; // Optional field for list/detail
}

// ====================================================================
// A. FIRS REGULATORY UPDATES QUERY 
// ====================================================================

// Assuming ApiResponse and ApiError are defined
// interface FirsResourceResponse extends ApiResponse<void> { data: FirsUpdate[]; }

export function useFirsRegulatoryUpdates(filters: { search?: string, source?: string } = {}) {
    return useQuery<FirsUpdate[], any>({ // Use 'any' for error type if ApiError isn't imported
        queryKey: ['firsRegulatoryUpdates', filters],
        queryFn: async () => {
            // --- Enhanced Mock Data Filter Logic (Replace with real API call) ---
            await new Promise(resolve => setTimeout(resolve, 500)); 
            
            const mockData: FirsUpdate[] = [
                { id: '1', title: 'FIRS Circular on Digital Assets Tax Treatment (New)', date: '2025-12-01', source: 'Circular', url: 'https://www.firs.gov.ng/circulars/circular-digital-assets', isNew: true, imageUrl: 'https://via.placeholder.com/800x450?text=Digital+Assets+Tax' },
                { id: '2', title: 'Review of the Finance Act 2025 - Key Amendments', date: '2025-11-28', source: 'Legislation', url: 'https://www.firs.gov.ng/legislation/finance-act-2025', isNew: false, imageUrl: 'https://via.placeholder.com/800x450?text=Finance+Act+2025' },
                { id: '3', title: 'State V.A.T. Remittance Procedures (Edo State)', date: '2025-10-15', source: 'Circular', url: 'https://www.firs.gov.ng/circulars/vat-edo', isNew: false, imageUrl: 'https://via.placeholder.com/800x450?text=VAT+Procedures' },
                { id: '4', title: 'New Penalty Regime for Late Filing of Returns', date: '2025-09-01', source: 'FIRS', url: 'https://www.firs.gov.ng/news/penalty-regime', isNew: false, imageUrl: 'https://via.placeholder.com/800x450?text=Filing+Penalties' },
                { id: '5', title: 'Tax Clearance Certificate (TCC) Online Processing Guide', date: '2025-08-10', source: 'FIRS', url: 'https://www.firs.gov.ng/tcc-guide', isNew: false, imageUrl: 'https://via.placeholder.com/800x450?text=TCC+Guide' },
                { id: '6', title: 'Supreme Court Ruling on Stamp Duties Jurisdiction', date: '2025-07-25', source: 'Legislation', url: 'https://www.firs.gov.ng/legal/stamp-duty', isNew: false, imageUrl: 'https://via.placeholder.com/800x450?text=Stamp+Duties' },
            ];

            const { search, source } = filters;
            let filtered = mockData;

            if (source && source !== 'all') {
                filtered = filtered.filter(u => u.source === source);
            }
            if (search) {
                const query = search.toLowerCase();
                filtered = filtered.filter(u => u.title.toLowerCase().includes(query));
            }

            return filtered;
        },
        staleTime: 5 * 60 * 1000, 
    });
}

// ====================================================================
// B. FIRS REGULATORY DETAIL QUERY 
// ====================================================================

// interface FirsDetailResponse extends ApiResponse<void> { data: FirsUpdate; }

export function useFirsRegulatoryDetail(id: string) {
    return useQuery<FirsUpdate, any>({
        queryKey: ['firsRegulatoryDetail', id],
        enabled: !!id,
        queryFn: async () => {
            // --- Enhanced Mock Detail Logic ---
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // NOTE: In a real app, this would hit /api/v1/firs/updates/${id}
            
            // Mock content is hardcoded for demonstration
            return {
                id,
                title: `Detailed Briefing: Digital Assets Circular ${id}`,
                date: '2025-12-01',
                source: 'Circular' as const,
                url: 'https://www.firs.gov.ng/full-circular-link',
                isNew: true,
                imageUrl: 'https://via.placeholder.com/1200x400?text=FIRS+Detail+Banner',
                content: `
                    The Federal Inland Revenue Service (FIRS) has officially released Circular No. 2025/01, providing comprehensive guidance on the taxation of digital assets within Nigeria.
                    
                    **Key Provisions Include:**
                    1.  **Capital Gains Tax (CGT):** The disposal of crypto assets, NFTs, and other digital tokens is now subject to CGT at a flat rate of 10%, aligning digital asset taxation with traditional investment gains.
                    2.  **VAT Implications:** Transactions involving digital currencies used as a medium of exchange remain outside the scope of VAT.
                    3.  **Reporting Compliance:** Financial institutions are now mandated to report high-value digital asset transactions.
                    
                    Our firm strongly advises all clients with exposure to the Nigerian digital economy to review their reporting frameworks immediately.
                `,
            } as FirsUpdate;
        },
    });
}

export function getUpdateColor(source: FirsUpdate['source']) {
    switch (source) {
        case 'Circular':
            return { border: 'border-red-400', bg: 'bg-red-50' };
        case 'Legislation':
            return { border: 'border-blue-400', bg: 'bg-blue-50' };
        default: // FIRS
            return { border: 'border-gray-400', bg: 'bg-gray-50' };
    }
}