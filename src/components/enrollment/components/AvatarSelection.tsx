import React, { useState } from 'react';

import { generatedAvatarUrl } from '../../../api/dicebearApi';

const AVATAR_STYLES = [
    'adventurer',
    'avataaars',
    'bottts',
    'fun-emoji',
    'lorelei',
    'micah',
    'miniavs',
    'pixel-art',
    'shapes',
    'thumbs',
] as const;

interface AvatarSelectorProps {
    onSelect: (url: string) => void;
    currentAvatar?: string;
}

const AvatarSelector = ({onSelect, currentAvatar}: AvatarSelectorProps) => {
    const [selectedStyle, setSelectedStyle] = useState<string>(
        AVATAR_STYLES[0],
    );
    const seed = Math.random().toString(36).substring(2, 15);

    const handleStyleSelect = (style: string) => {
        setSelectedStyle(style);
        const newAvatarUrl = generatedAvatarUrl(style as any, seed);
        onSelect(newAvatarUrl);
    };

    return (
        <div className='p-4'>
            <h3 className='text-lg font-semibold mb-4'>Select Avatar Style</h3>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                {AVATAR_STYLES.map((style) => {
                    const avatarUrl = generatedAvatarUrl(style as any, seed);
                    return (
                        <div
                            key={style}
                            className={`cursor-pointer p-2 border-2 ${
                                selectedStyle === style
                                    ? 'border-primary'
                                    : 'border-gray'
                            }`}
                            onClick={() => handleStyleSelect(style)}
                        >
                            <img
                                src={avatarUrl}
                                alt={style}
                                className='w-12 h-12 mx-auto mb-2'
                            />
                            <p className='text-center text-sm capitalize'>
                                {style.replace('-', ' ')}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AvatarSelector;
