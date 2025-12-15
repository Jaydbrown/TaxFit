export interface AttorneyDashboardStats {
    earnings: {
        totalEarnings: number;
        walletBalance: number;
        pendingWithdrawal: number;
    };
    consultations: {
        totalCompleted: number;
        upcoming: number;
    };
    performance: {
        averageRating: number;
        totalReviews: number;
    };
}