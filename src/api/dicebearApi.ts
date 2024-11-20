import {dicebearStyle} from '../types/avatar';

/**
 * Generate DiceBear avatar URL with two params.
 * @param style
 * @param seed
 * @returns
 */
export const generatedAvatarUrl = (
    style: dicebearStyle,
    seed: string,
): string => {
    return `${
        import.meta.env.DICE_BEAR_BASE_URL
    }/${style}/svg?seed=${encodeURIComponent(seed)}`;
};

/**
 * Download DiceBear avatar URL with one param.
 * @param avatarUrl
 * @returns
 */
export const downloadAvatarUrl = async (avatarUrl: string): Promise<Blob> => {
    try {
        // Fetch avatar url and wait for response.
        const response = await fetch(avatarUrl);
        // If response is not okay, then throw exception.
        if (!response) {
            throw new Error('Failed to fetch avatar url.');
        }
        // Else, return for wait response.
        return await response.blob();
    } catch (error) {
        console.error('Error downloading avatar url: ', error);
        throw error;
    }
};
