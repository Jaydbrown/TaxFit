import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Link is not used, only useNavigate
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Badge from '@/components/common/Badge';

import { Bell, Search, Filter, Loader2, XCircle } from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import { 
    useFirsRegulatoryUpdates, 
    getUpdateColor, 
    FirsUpdate 
} from '@/hooks/attorney/use-firs-resources';

// Define the filter options based on the defined source types
const sourceOptions = [
    { value: 'all', label: 'All Sources' },
    { value: 'FIRS', label: 'FIRS News/Announcements' },
    { value: 'Circular', label: 'Circulars/Guidance' },
    { value: 'Legislation', label: 'Legislative Updates' },
];

// --- Helper Component for Rendering Individual Item ---
const NewsItem: React.FC<{ update: FirsUpdate }> = ({ update }) => {
    const { border, bg } = getUpdateColor(update.source);
    const navigate = useNavigate(); // Use useNavigate for internal routing

    return (
        <Card className="p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="block"> 
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg flex items-center">
                        <span>{update.title}</span>
                        {update.isNew && (
                            <Badge variant="danger" className="ml-3">NEW</Badge>
                        )}
                    </h3>
                    <Badge 
                        variant="neutral" 
                        className={`font-medium text-xs ${border.replace('border-', 'text-')} ${bg.replace('bg-', 'bg-')}`}
                    >
                        {update.source}
                    </Badge>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                    <p>Published: {formatDate(update.date)}</p>
                    
                    {/* FIX: Use Button with onClick and navigate to the new dynamic route */}
                    <Button 
                        variant="link" 
                        size="sm"
                        onClick={() => navigate(`/firs-news/${update.id}`)}
                    >
                        Read Full Text
                    </Button>
                </div>
            </div>
        </Card>
    );
};
// --- End Helper Component ---


export default function FirsNewsFeedPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sourceFilter, setSourceFilter] = useState('all');

    // Fetch the raw data
    const { 
        data: updates = [], // Ensure default empty array to prevent issues during hydration
        isLoading, 
        isError, 
        refetch 
    } = useFirsRegulatoryUpdates({
        search: searchQuery,
        source: sourceFilter,
    });

    // Memoize the sorting logic
    const filteredAndSortedUpdates = useMemo(() => {
        // Sort by date descending
        return updates.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [updates]);

    // --- Rendering Logic ---
    let content;

    if (isLoading) {
        content = (
            <div className="text-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
                <p className="text-lg text-gray-600">Loading FIRS News Feed...</p>
            </div>
        );
    } else if (isError) {
        content = (
            <div className="text-center py-20 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="w-8 h-8 mx-auto mb-4" />
                <p className="text-xl mb-2">Error connecting to FIRS API Proxy.</p>
                <Button onClick={() => refetch()} variant="primary" className="mt-4">Retry Loading</Button>
            </div>
        );
    } else if (filteredAndSortedUpdates.length === 0) {
        content = (
            <div className="text-center py-20 text-gray-500 border border-dashed rounded-lg bg-white">
                <p className="text-xl font-medium mb-2">No Updates Found</p>
                <p>Try adjusting your filters or search query.</p>
            </div>
        );
    } else {
        content = (
            <div className="space-y-4">
                {filteredAndSortedUpdates.map(update => (
                    // FIX: Ensure update has a title before rendering NewsItem (although hook should guarantee this)
                    update.title ? <NewsItem key={update.id} update={update} /> : null
                ))}
            </div>
        );
    }


    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
                <header className="mb-8 border-b pb-4">
                    <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                        <Bell className="w-8 h-8 text-red-500" />
                        FIRS Regulatory News Feed
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">All official circulars, news, and legislative updates from the Federal Inland Revenue Service.</p>
                </header>

                {/* Filter and Search Bar */}
                <Card className="mb-8 p-5">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-2/5">
                            <Input
                                type="text"
                                label="Search Title or Content"
                                placeholder="Search by topic..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                leftIcon={<Search className="w-4 h-4" />}
                            />
                        </div>
                        <div className="w-full md:w-1/4">
                            <Select
                                label="Filter by Source"
                                options={sourceOptions}
                                value={sourceFilter}
                                onChange={(e) => setSourceFilter(e.target.value)}
                                leftIcon={<Filter className="w-4 h-4" />}
                            />
                        </div>
                        <div className="w-full md:w-1/4 self-end">
                            <Button 
                                variant='outline' 
                                className="w-full" 
                                onClick={() => {
                                    setSourceFilter('all');
                                    setSearchQuery('');
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* News Content Area */}
                {content}

            </div>
        </Layout>
    );
}