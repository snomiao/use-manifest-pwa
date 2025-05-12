import { renderHook } from '@testing-library/react';
import { type Manifest } from './Manifest';
import './setup';
import useManifestPWA from './useManifestPWA';
import useServiceWorker from './useServiceWorker';

describe('PWA Integration', () => {
  const mockManifest: Manifest & Required<Pick<Manifest, "name" | "icons" | "start_url">> = {
    name: 'Test PWA',
    icons: [
      {
        src: 'icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    start_url: '/',
    display: 'standalone',
    theme_color: '#ffffff',
    background_color: '#ffffff'
  };

  const mockServiceWorker = () => {
    self.addEventListener('fetch', (event) => {
      console.log('fetch event');
    });
  };

  beforeEach(() => {
    // Mock document.head
    document.head.innerHTML = '';
    
    // Mock service worker
    // @ts-ignore - mocking
    navigator.serviceWorker = {
      register: jest.fn().mockResolvedValue({
        unregister: () => Promise.resolve(true)
      })
    };
  });

  afterEach(() => {
    // Clean up
    document.head.innerHTML = '';
    // Clean up any blob URLs
    const blobUrls = document.body.innerHTML.match(/blob:[^"')]+/g) || [];
    blobUrls.forEach(URL.revokeObjectURL);
  });

  test('sets up complete PWA environment', () => {
    // Set up manifest
    renderHook(() => useManifestPWA(mockManifest));
    
    // Set up service worker
    renderHook(() => useServiceWorker(mockServiceWorker));

    // Check manifest is added
    const manifestLink = document.head.querySelector('link[rel="manifest"]');
    expect(manifestLink).not.toBeNull();
    expect(manifestLink.href).toContain('blob:');

    // Check service worker is registered
    expect(navigator.serviceWorker.register).toHaveBeenCalled();
  });

  test('manifest contains required icons for installability', async () => {
    renderHook(() => useManifestPWA(mockManifest));
    
    const manifestLink = document.head.querySelector('link[rel="manifest"]');
    const response = await fetch(manifestLink.href);
    const manifestContent = await response.json();
    
    // Check for required icon sizes (192x192 and 512x512 are required for Chrome)
    const has192 = manifestContent.icons.some(icon => icon.sizes === '192x192');
    const has512 = manifestContent.icons.some(icon => icon.sizes === '512x512');
    
    expect(has192).toBe(true);
    expect(has512).toBe(true);
  });

  test('updates both manifest and service worker when changed', () => {
    const { rerender: rerenderManifest } = renderHook(
      (manifest) => useManifestPWA(manifest),
      { initialProps: mockManifest }
    );

    const { rerender: rerenderSW } = renderHook(
      ({ worker }) => useServiceWorker(worker),
      { initialProps: { worker: mockServiceWorker } }
    );

    // Update manifest
    const updatedManifest = {
      ...mockManifest,
      name: 'Updated PWA'
    };
    rerenderManifest(updatedManifest);

    // Update service worker
    const newWorker = () => {
      self.addEventListener('fetch', (event) => {
        console.log('new fetch event');
      });
    };
    rerenderSW({ worker: newWorker });

    // Check both were updated
    expect(document.head.querySelector('link[rel="manifest"]').href).toContain('blob:');
    expect(navigator.serviceWorker.register).toHaveBeenCalledTimes(2);
  });
});
