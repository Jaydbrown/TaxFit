import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { BookOpen, Calendar, AlertTriangle, ArrowLeft, Loader2, XCircle } from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import { useFirsRegulatoryDetail } from '@/hooks/attorney/use-firs-resources';

export default function FirsNewsDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Fetch the single article details
    const { 
        data: article, 
        isLoading, 
        isError, 
        refetch 
    } = useFirsRegulatoryDetail(id || '');

    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    <p className="ml-3 text-lg text-gray-600">Loading regulatory briefing...</p>
                </div>
            </Layout>
        );
    }

    // 🎯 FIX: Guards the component against accessing properties if data is missing or errored
    if (isError || !article || !article.title) { 
        return (
            <Layout>
                <div className="container mx-auto px-6 py-12 text-center">
                    <Card className="p-10 bg-red-50 border border-red-200">
                        <XCircle className="w-10 h-10 text-red-600 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Briefing Not Found</h1>
                        <p className="text-lg text-gray-600 mb-6">The requested regulatory update could not be loaded or does not exist.</p>
                        <Button onClick={() => navigate('/firs-news-feed')} leftIcon={<ArrowLeft />}>
                            Back to News Feed
                        </Button>
                    </Card>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-6 py-12 min-h-screen">
                
                <Button variant="link" onClick={() => navigate(-1)} leftIcon={<ArrowLeft className='w-4 h-4' />} className='mb-6'>
                    Back to News Feed
                </Button>

                {/* Article Image Banner */}
                {article.imageUrl && (
                    <div 
                        className="w-full aspect-[3/1] bg-gray-200 mb-8 rounded-lg shadow-xl"
                        style={{ 
                            backgroundImage: `url(${article.imageUrl})`, 
                            backgroundSize: 'cover', 
                            backgroundPosition: 'center' 
                        }}
                    />
                )}

                <Card className="p-8 shadow-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <BookOpen className="w-6 h-6 text-primary-600" />
                        <h3 className="text-lg uppercase tracking-widest text-gray-500">{article.source}</h3>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                        {article.title}
                    </h1>

                    <div className="flex items-center text-sm text-gray-600 space-x-4 border-b pb-4 mb-8">
                        <span className='flex items-center gap-2'>
                            <Calendar className='w-4 h-4' />
                            Published: {formatDate(article.date)}
                        </span>
                        {article.isNew && <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">NEW</span>}
                    </div>

                    {/* Article Content Area - Renders safely based on content being available */}
                    {article.content && (
                        <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6">
                            <p className='whitespace-pre-line'>
                                {article.content}
                            </p>
                        </div>
                    )}

                    <div className='mt-10 pt-6 border-t'>
                        <a 
                            href={article.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className='inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800'
                        >
                            <AlertTriangle className='w-4 h-4' />
                            View Original Source Document
                        </a>
                    </div>
                </Card>
            </div>
        </Layout>
    );
}