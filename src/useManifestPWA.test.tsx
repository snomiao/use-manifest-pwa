import { renderHook } from '@testing-library/react';
import './setup';
import useManifestPWA from './useManifestPWA';

describe('useManifestPWA', () => {
  const mockManifest = {
    name: 'Test App',
    icons: [
      {
        src: 'test-icon.png',
        sizes: '192x192',
        type: 'image/png'
      }
    ],
    start_url: '/',
    display: 'standalone' as const
  };

  let linkElement: HTMLLinkElement | null;

  beforeEach(() => {
    // Mock document.head
    document.head.innerHTML = '';
  });

  afterEach(() => {
    // Clean up
    document.head.innerHTML = '';
    if (linkElement?.href) {
      URL.revokeObjectURL(linkElement.href);
    }
  });

  test('creates manifest link element if none exists', () => {
    renderHook(() => useManifestPWA(mockManifest));
    
    linkElement = document.head.querySelector('link[rel="manifest"]');
    expect(linkElement).not.toBeNull();
    expect(linkElement?.rel).toBe('manifest');
    expect(linkElement?.href).toContain('blob:');
  });

  test('updates existing manifest link element', () => {
    // Create initial manifest link
    const initialLink = document.createElement('link');
    initialLink.rel = 'manifest';
    initialLink.href = 'initial-manifest.json';
    document.head.appendChild(initialLink);

    renderHook(() => useManifestPWA(mockManifest));
    
    linkElement = document.head.querySelector('link[rel="manifest"]');
    expect(linkElement).toBe(initialLink);
    expect(linkElement?.href).not.toBe('initial-manifest.json');
    expect(linkElement?.href).toContain('blob:');
  });

  test('creates blob URL with correct manifest content', async () => {
    renderHook(() => useManifestPWA(mockManifest));
    
    linkElement = document.head.querySelector('link[rel="manifest"]');
    if (!linkElement?.href) {
      throw new Error('Link element or href not found');
    }
    const response = await fetch(linkElement.href);
    const manifestContent = await response.json();
    
    expect(manifestContent).toEqual(mockManifest);
  });

  test('updates manifest when props change', () => {
    const { rerender } = renderHook(
      (manifest) => useManifestPWA(manifest), 
      { initialProps: mockManifest }
    );

    const updatedManifest = {
      ...mockManifest,
      name: 'Updated Test App'
    };

    rerender(updatedManifest);
    
    linkElement = document.head.querySelector('link[rel="manifest"]');
    expect(linkElement?.href).toContain('blob:');
  });
});
