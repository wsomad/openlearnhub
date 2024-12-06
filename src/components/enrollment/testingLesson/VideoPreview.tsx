import { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

interface VideoPreviewProps {
    url: string; // YouTube video URL
    onDurationChange: (duration: number) => void; // Callback for video duration updates
    height?: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
    url,
    onDurationChange,
    height,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Refs for managing YouTube player instance and container
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize YouTube player with provided video ID
    const initializeYouTubePlayer = (videoId: string) => {
        if (!window.YT || !window.YT.Player) {
            return setTimeout(() => initializeYouTubePlayer(videoId), 100);
        }

        // Cleanup existing player if any
        if (playerRef.current) {
            playerRef.current.destroy();
        }

        try {
            // Create new YouTube player instance
            playerRef.current = new window.YT.Player(containerRef.current, {
                videoId,
                height: '100%',
                width: '100%',
                playerVars: {
                    autoplay: 0,
                    controls: 1,
                    modestbranding: 1,
                },
                events: {
                    // Update duration and loading state when video is ready
                    onReady: (event: any) => {
                        const duration = event.target.getDuration();
                        onDurationChange(Math.ceil(duration / 60));
                        setIsLoading(false);
                    },
                    onError: () => {
                        setError('Failed to load video');
                        setIsLoading(false);
                    },
                },
            });
        } catch (err) {
            setError('Error initializing video player');
            setIsLoading(false);
        }
    };

    // Load YouTube API script when component mounts
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        // Cleanup player on unmount
        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, []);

    // Extract YouTube video ID from URL using regex
    useEffect(() => {
        if (!url) {
            setError(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        const videoId = extractYouTubeId(url);
        if (!videoId) {
            setError('Invalid YouTube URL');
            setIsLoading(false);
            return;
        }

        // Reset container
        if (containerRef.current) {
            containerRef.current.innerHTML = '';
        }

        // Initialize player with retry
        initializeYouTubePlayer(videoId);
    }, [url]);

    const extractYouTubeId = (url: string): string | null => {
        const regex =
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    return (
        <div className={`${height || 'h-[500px]'}`}>
            <div className='w-full h-full bg-gray-100 rounded relative'>
                <div ref={containerRef} className='absolute inset-0' />
                {isLoading && (
                    <div className='absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                    </div>
                )}
                {error && (
                    <div className='absolute inset-0 flex items-center justify-center bg-gray-100 text-red-500 z-10'>
                        <p>{error}</p>
                    </div>
                )}
                {!url && !error && !isLoading && (
                    <div className='absolute inset-0 flex items-center justify-center text-gray-500 z-10'>
                        Enter a valid YouTube URL to see preview
                    </div>
                )}
            </div>
            {url && !error && (
                <p className='text-sm text-gray-600'>
                    {isLoading
                        ? 'Loading video...'
                        : 'Video loaded successfully'}
                </p>
            )}
        </div>
    );
};

export default VideoPreview;
