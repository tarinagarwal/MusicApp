import { toast } from './toast';

interface ShareOptions {
  title: string;
  text: string;
  url: string;
}

export async function shareContent(options: ShareOptions): Promise<boolean> {
  // First try native sharing
  if (navigator.share) {
    try {
      await navigator.share(options);
      return true;
    } catch (err) {
      // If user cancelled sharing, don't fallback to clipboard
      if ((err as Error).name === 'AbortError') {
        return false;
      }
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(options.url);
    toast.success('Link copied to clipboard!');
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    toast.error('Failed to copy link');
    return false;
  }
}