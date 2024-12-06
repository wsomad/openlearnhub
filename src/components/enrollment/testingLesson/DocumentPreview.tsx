import { useEffect, useState } from 'react';

type DocumentType = 'pdf' | 'doc' | 'image' | 'google-doc' | 'unknown';

interface DocumentPreviewProps {
    url: string; // URL of the document to preview
    height?: string;
}

const DocumentIcon = (props: any) => (
    <svg {...props} viewBox='0 0 24 24' fill='none' stroke='currentColor'>
        <path d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
    </svg>
);

const FileIcon = (props: any) => (
    <svg {...props} viewBox='0 0 24 24' fill='none' stroke='currentColor'>
        <path d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
    </svg>
);

const DocumentPreview: React.FC<DocumentPreviewProps> = ({url, height}) => {
    // State for managing loading and error states
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewReady, setPreviewReady] = useState(false);

    // Determine document type from URL or file extension
    const getDocumentType = (url: string): DocumentType => {
        const extension = url.split('.').pop()?.toLowerCase();
        if (extension === 'pdf') return 'pdf';
        if (['doc', 'docx'].includes(extension || '')) return 'doc';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || ''))
            return 'image';
        if (url.includes('docs.google.com')) return 'google-doc';
        return 'unknown';
    };

    // Monitor URL changes and validate document
    useEffect(() => {
        if (!url) return;
        setIsLoading(true);
        setError(null);
        setPreviewReady(false);

        // Validate URL format
        try {
            new URL(url);
        } catch {
            setError('Invalid URL format');
            setIsLoading(false);
            return;
        }

        // Special handling for image type documents
        if (getDocumentType(url) === 'image') {
            const img = new Image();
            img.onload = () => {
                setIsLoading(false);
                setPreviewReady(true);
            };
            img.onerror = () => {
                setError('Failed to load image');
                setIsLoading(false);
            };
            img.src = url;
        } else {
            setIsLoading(false);
            setPreviewReady(true);
        }
    }, [url]);

    // Render appropriate preview based on document type
    const renderPreview = () => {
        const type = getDocumentType(url);

        switch (type) {
            case 'pdf':
                return (
                    <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                            url,
                        )}&embedded=true`}
                        className='w-full h-full rounded'
                        onLoad={() => setIsLoading(false)}
                        onError={() => setError('Failed to load PDF')}
                    />
                );
            case 'image':
                return (
                    <img
                        src={url}
                        alt='Document preview'
                        className='max-w-full h-auto rounded object-contain'
                    />
                );
            case 'google-doc':
                return (
                    <iframe
                        src={`${url}?embedded=true`}
                        className='w-full h-full rounded'
                        onLoad={() => setIsLoading(false)}
                        onError={() => setError('Failed to load Google Doc')}
                    />
                );
            case 'doc':
                return (
                    <div className='flex flex-col items-center justify-center h-full text-gray-500 space-y-2'>
                        <DocumentIcon className='w-12 h-12' />
                        <p>Microsoft Word document</p>
                        <p className='text-sm'>
                            Preview available after upload
                        </p>
                    </div>
                );
            default:
                return (
                    <div className='flex flex-col items-center justify-center h-full text-gray-500 space-y-2'>
                        <FileIcon className='w-12 h-12' />
                        <p>Unsupported document type</p>
                        <p className='text-sm'>
                            Please use PDF, image, or Google Doc link
                        </p>
                    </div>
                );
        }
    };

    return (
        <div
            className={`${
                height || 'h-[500px]'
            } bg-gray-100 rounded overflow-hidden relative`}
        >
            {isLoading && (
                <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                </div>
            )}
            {error && (
                <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
                    <p className='text-red-500'>{error}</p>
                </div>
            )}
            {!url && !error && !isLoading && (
                <div className='flex items-center justify-center h-full text-gray-500'>
                    Enter a valid document URL to see preview
                </div>
            )}
            {url && !error && previewReady && renderPreview()}
        </div>
    );
};

export default DocumentPreview;
