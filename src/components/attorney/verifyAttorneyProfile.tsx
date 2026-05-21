import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Shield,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Trash2,
  Info,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import {
  useVerificationStatus,
  useSubmitVerification,
  useUploadDocument,
} from '@/hooks/attorney/use-verification';
import { useAuthStore } from '@/store/auth-store';
import { useProfile } from '@/hooks/auth/use-auth';

// --- VALIDATION SCHEMA ---
const verificationSchema = z.object({
  hourlyRate: z.coerce.number().min(1000, 'Minimum rate is ₦1,000').max(10000000, 'Maximum rate is ₦10,000,000'),
  consultationFee: z.coerce.number().min(0, 'Cannot be negative').max(10000000, 'Maximum fee is ₦10,000,000'),
  minConsultationDuration: z.coerce.number().min(15, 'Minimum 15 minutes').max(480, 'Maximum 8 hours'),
  maxConsultationDuration: z.coerce.number().min(30, 'Minimum 30 minutes').max(480, 'Maximum 8 hours'),
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(2000, 'Bio must be under 2000 characters'),
  specializations: z.string().min(1, 'Enter at least one specialization'),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

// --- DOCUMENT TYPES ---
const DOCUMENT_TYPES = [
  { value: 'call_to_bar', label: 'Call to Bar Certificate', description: 'Your Nigerian Bar Association call to bar certificate' },
  { value: 'practicing_license', label: 'Practicing License', description: 'Current year practicing license from NBA' },
  { value: 'law_degree', label: 'Law Degree (LLB/BL)', description: 'Your law degree certificate' },
  { value: 'national_id', label: 'National ID / NIN', description: 'Valid government-issued identification' },
  { value: 'tax_clearance', label: 'Tax Clearance Certificate', description: 'Current tax clearance certificate' },
  { value: 'other', label: 'Other Supporting Document', description: 'Any other relevant professional document' },
];

// --- STATUS DISPLAY COMPONENT ---
function VerificationStatusBanner({ status, rejectionReason, rejectionDetails }: {
  status: string;
  rejectionReason?: string;
  rejectionDetails?: string;
}) {
  const config: Record<string, { icon: React.ReactNode; bg: string; border: string; text: string; title: string; description: string }> = {
    draft: {
      icon: <FileText className="w-6 h-6 text-gray-500" />,
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-700',
      title: 'Verification Not Started',
      description: 'Complete the form below and upload your documents to begin the verification process.',
    },
    pending: {
      icon: <Clock className="w-6 h-6 text-yellow-600" />,
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      title: 'Verification Pending Review',
      description: 'Your submission is being reviewed by our admin team. This typically takes 1-3 business days.',
    },
    approved: {
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      title: 'Verified Attorney ✓',
      description: 'Congratulations! Your profile is verified and visible to potential clients.',
    },
    rejected: {
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      title: 'Verification Rejected',
      description: rejectionReason || 'Your submission was not approved. Please review the feedback and resubmit.',
    },
  };

  const current = config[status] || config.draft;

  return (
    <div className={`${current.bg} ${current.border} border rounded-xl p-6 mb-8`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">{current.icon}</div>
        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${current.text}`}>{current.title}</h3>
          <p className={`mt-1 text-sm ${current.text} opacity-80`}>{current.description}</p>
          {status === 'rejected' && rejectionDetails && (
            <div className="mt-3 p-3 bg-white/60 rounded-lg border border-red-100">
              <p className="text-sm text-red-700 font-medium">Admin Feedback:</p>
              <p className="text-sm text-red-600 mt-1">{rejectionDetails}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function AttorneyVerificationPage() {
  const navigate = useNavigate();
  useAuthStore();
  const { data: profile } = useProfile();
  const { data: verificationData, isLoading: statusLoading } = useVerificationStatus();
  const { mutate: submitVerification, isPending: isSubmitting } = useSubmitVerification();
  const { mutate: uploadDocument, isPending: isUploading } = useUploadDocument();

  // Document upload state
  const [uploadedDocs, setUploadedDocs] = useState<Array<{ type: string; file: File; name: string }>>([]);
  const [selectedDocType, setSelectedDocType] = useState('call_to_bar');
  const [dragActive, setDragActive] = useState(false);

  const currentStatus = verificationData?.verificationStatus || 'draft';
  const attorneyProfile = profile?.attorney;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      hourlyRate: attorneyProfile?.hourlyRate || 50000,
      consultationFee: attorneyProfile?.consultationFee || 25000,
      minConsultationDuration: attorneyProfile?.minConsultationDuration || 30,
      maxConsultationDuration: attorneyProfile?.maxConsultationDuration || 120,
      bio: attorneyProfile?.bio || '',
      specializations: attorneyProfile?.specializations?.join(', ') || '',
    },
  });

  const bioValue = watch('bio');

  // --- FILE HANDLING ---
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file.size > maxSize) {
      alert('File size must be under 10MB');
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, JPG, and PNG files are accepted');
      return;
    }

    setUploadedDocs((prev) => [
      ...prev,
      { type: selectedDocType, file, name: file.name },
    ]);
  }, [selectedDocType]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const removeDocument = (index: number) => {
    setUploadedDocs((prev) => prev.filter((_, i) => i !== index));
  };

  // --- UPLOAD ALL DOCS THEN SUBMIT ---
  const onSubmit = async (formData: VerificationFormData) => {
    if (uploadedDocs.length === 0) {
      alert('Please upload at least one professional document before submitting.');
      return;
    }

    // Step 1: Upload all documents
    for (const doc of uploadedDocs) {
      const fd = new FormData();
      fd.append('document', doc.file);
      fd.append('documentType', doc.type);

      await new Promise<void>((resolve, reject) => {
        uploadDocument(fd, {
          onSuccess: () => resolve(),
          onError: (err) => reject(err),
        });
      });
    }

    // Step 2: Submit verification with form data
    const specializations = formData.specializations
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    submitVerification(
      {
        hourlyRate: formData.hourlyRate,
        consultationFee: formData.consultationFee,
        minConsultationDuration: formData.minConsultationDuration,
        maxConsultationDuration: formData.maxConsultationDuration,
        bio: formData.bio,
        specializations,
      },
      {
        onSuccess: () => {
          navigate('/attorney/dashboard');
        },
      }
    );
  };

  // --- LOADING STATE ---
  if (statusLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading verification status...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // --- APPROVED STATE (Read Only) ---
  if (currentStatus === 'approved') {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            <VerificationStatusBanner status="approved" />
            <div className="text-center mt-8">
              <Button onClick={() => navigate('/attorney/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // --- PENDING STATE (Read Only) ---
  if (currentStatus === 'pending') {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            <VerificationStatusBanner status="pending" />
            <Card className="p-6 text-center">
              <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sit Tight!</h3>
              <p className="text-gray-600 mb-6">
                Our team is reviewing your documents. You'll be notified once the review is complete.
              </p>
              <Button onClick={() => navigate('/attorney/dashboard')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // --- FORM STATE (draft or rejected) ---
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/attorney/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Attorney Verification</h1>
                <p className="text-gray-600 mt-1">
                  Submit your credentials to get verified and start accepting clients
                </p>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          <VerificationStatusBanner
            status={currentStatus}
            rejectionReason={verificationData?.rejectionReason}
            rejectionDetails={verificationData?.rejectionDetails}
          />

          {/* Main Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Professional Information */}
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" />
                Professional Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio *
                  </label>
                  <textarea
                    {...register('bio')}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-shadow"
                    placeholder="Describe your legal experience, areas of expertise, and what sets you apart as an attorney..."
                  />
                  <div className="flex justify-between mt-1">
                    {errors.bio && (
                      <p className="text-sm text-red-500">{errors.bio.message}</p>
                    )}
                    <p className="text-sm text-gray-400 ml-auto">
                      {bioValue?.length || 0}/2000
                    </p>
                  </div>
                </div>

                <div>
                  <Input
                    label="Specializations *"
                    {...register('specializations')}
                    error={errors.specializations?.message}
                    placeholder="Tax Law, Corporate Law, Estate Planning (comma-separated)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate multiple specializations with commas
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 2: Rates & Consultation */}
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-primary-600 font-bold">₦</span>
                Rates & Consultation Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Hourly Rate (₦) *"
                  type="number"
                  {...register('hourlyRate')}
                  error={errors.hourlyRate?.message}
                  placeholder="50000"
                />
                <Input
                  label="Consultation Fee (₦) *"
                  type="number"
                  {...register('consultationFee')}
                  error={errors.consultationFee?.message}
                  placeholder="25000"
                />
                <Input
                  label="Min Consultation Duration (mins) *"
                  type="number"
                  {...register('minConsultationDuration')}
                  error={errors.minConsultationDuration?.message}
                  placeholder="30"
                />
                <Input
                  label="Max Consultation Duration (mins) *"
                  type="number"
                  {...register('maxConsultationDuration')}
                  error={errors.maxConsultationDuration?.message}
                  placeholder="120"
                />
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Your hourly rate and consultation fee will be displayed on your public profile. 
                  You can update these anytime after verification.
                </p>
              </div>
            </Card>

            {/* Section 3: Document Upload */}
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary-600" />
                Professional Documents
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Upload at least one document to verify your identity and legal credentials.
              </p>

              {/* Document Type Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow bg-white"
                >
                  {DOCUMENT_TYPES.map((dt) => (
                    <option key={dt.value} value={dt.value}>
                      {dt.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {DOCUMENT_TYPES.find((d) => d.value === selectedDocType)?.description}
                </p>
              </div>

              {/* Drag & Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                  ${dragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className={`w-10 h-10 mx-auto mb-3 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`} />
                <p className="text-gray-700 font-medium">
                  {dragActive ? 'Drop your file here' : 'Click or drag & drop to upload'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  PDF, JPG, PNG — Max 10MB per file
                </p>
              </div>

              {/* Uploaded Documents List */}
              {uploadedDocs.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    Documents to submit ({uploadedDocs.length})
                  </h4>
                  {uploadedDocs.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {DOCUMENT_TYPES.find((d) => d.value === doc.type)?.label || doc.type}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(idx)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Missing requirements hint */}
              {verificationData?.missingRequirements && verificationData.missingRequirements.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Missing Requirements:</p>
                      <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside">
                        {verificationData.missingRequirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pb-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/attorney/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || isUploading || uploadedDocs.length === 0}
                className="bg-primary-600 hover:bg-primary-700 text-white min-w-[200px]"
              >
                {isSubmitting || isUploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isUploading ? 'Uploading Documents...' : 'Submitting...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Submit for Verification
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}