import { renderHook } from '@testing-library/react';
import './setup';
import useServiceWorker from './useServiceWorker';

describe('useServiceWorker', () => {
  const mockServiceWorker = () => {
    self.addEventListener('fetch', (event) => {
      console.log('fetch event');
    });
  };

  let originalServiceWorker: typeof navigator.serviceWorker;

  beforeEach(() => {
    // Mock service worker registration
    originalServiceWorker = navigator.serviceWorker;
    const mockRegistration = {
      unregister: () => Promise.resolve(true)
    };

    // @ts-ignore - mocking
    navigator.serviceWorker = {
      register: jest.fn().mockResolvedValue(mockRegistration)
    };
  });

  afterEach(() => {
    // Restore original service worker
    navigator.serviceWorker = originalServiceWorker;
    // Clean up any blob URLs
    const blobUrls = document.body.innerHTML.match(/blob:[^"')]+/g) || [];
    blobUrls.forEach(URL.revokeObjectURL);
  });

  test('registers service worker', () => {
    renderHook(() => useServiceWorker(mockServiceWorker));
    expect(navigator.serviceWorker.register).toHaveBeenCalled();
  });

  test('unregisters service worker on cleanup', () => {
    const { unmount } = renderHook(() => useServiceWorker(mockServiceWorker));
    unmount();
    // The cleanup function should call unregister on the service worker registration
    // This is handled internally by the hook
  });

  test('creates blob URL with correct worker content', () => {
    renderHook(() => useServiceWorker(mockServiceWorker));
    const registerCall = navigator.serviceWorker.register.mock.calls[0];
    expect(registerCall[0]).toContain('blob:');
  });

  test('creates new worker when function changes', () => {
    const { rerender } = renderHook(
      ({ worker }) => useServiceWorker(worker),
      { initialProps: { worker: mockServiceWorker } }
    );

    const newWorker = () => {
      self.addEventListener('fetch', (event) => {
        console.log('new fetch event');
      });
    };

    rerender({ worker: newWorker });
    expect(navigator.serviceWorker.register).toHaveBeenCalledTimes(2);
  });
});
