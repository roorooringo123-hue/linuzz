// Wallpapers — bundled as ES module imports so URLs are stable.
import aurora from '@/assets/wallpaper-aurora.jpg';
import mountains from '@/assets/wallpaper-mountains.jpg';
import neon from '@/assets/wallpaper-neon.jpg';
import waves from '@/assets/wallpaper-waves.jpg';

export interface WallpaperOption {
  id: string;
  name: string;
  url: string;
}

export const WALLPAPERS: WallpaperOption[] = [
  { id: 'aurora', name: 'Aurora', url: aurora },
  { id: 'mountains', name: 'Starry Night', url: mountains },
  { id: 'neon', name: 'Neon City', url: neon },
  { id: 'waves', name: 'Deep Waves', url: waves },
];

export const DEFAULT_WALLPAPER = WALLPAPERS[0].url;

export const getWallpaperUrl = (idOrUrl: string): string => {
  const found = WALLPAPERS.find((w) => w.id === idOrUrl || w.url === idOrUrl);
  return found ? found.url : DEFAULT_WALLPAPER;
};
