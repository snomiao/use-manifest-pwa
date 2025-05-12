import { offlineCacheWorker } from './offlineCacheWorker';
import { FetchEvent } from './useServiceWorker';

describe('offlineCacheWorker', () => {
  beforeEach(() => {
    // Mock caches API
    // @ts-ignore - mocking
    global.caches = {
      match: jest.fn()
    };
    // @ts-ignore - mocking
    global.fetch = jest.fn();
    // @ts-ignore - mocking
    global.self = {
      addEventListener: jest.fn()
    };
  });

  test('registers fetch event listener', () => {
    offlineCacheWorker();
    expect(self.addEventListener).toHaveBeenCalledWith('fetch', expect.any(Function));
  });

  test('registers install event listener', () => {
    offlineCacheWorker();
    expect(self.addEventListener).toHaveBeenCalledWith('installed', expect.any(Function));
  });

  test('fetch handler checks cache first', async () => {
    offlineCacheWorker();
    
    // Get the fetch event handler
    const fetchHandler = (self.addEventListener as jest.Mock).mock.calls
      .find(([event]) => event === 'fetch')[1];

    // Create a mock fetch event
    const mockRequest = new Request('https://example.com');
    const mockEvent = {
      request: mockRequest,
      respondWith: jest.fn()
    } as unknown as FetchEvent;

    // Call the fetch handler
    fetchHandler(mockEvent);
    expect(caches.match).toHaveBeenCalledWith(mockRequest);
  });

  test('fetch handler falls back to network if cache miss', async () => {
    // Mock cache miss
    (global.caches.match as jest.Mock).mockResolvedValue(undefined);
    // Mock successful network request
    const mockResponse = new Response('test');
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    offlineCacheWorker();
    
    // Get the fetch event handler
    const fetchHandler = (self.addEventListener as jest.Mock).mock.calls
      .find(([event]) => event === 'fetch')[1];

    // Create a mock fetch event
    const mockRequest = new Request('https://example.com');
    const mockEvent = {
      request: mockRequest,
      respondWith: jest.fn()
    } as unknown as FetchEvent;

    // Call the fetch handler
    fetchHandler(mockEvent);
    
    // Wait for promises to resolve
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(global.fetch).toHaveBeenCalledWith(mockRequest);
  });

  test('fetch handler returns cached response if available', async () => {
    // Mock cache hit
    const cachedResponse = new Response('cached');
    (global.caches.match as jest.Mock).mockResolvedValue(cachedResponse);

    offlineCacheWorker();
    
    // Get the fetch event handler
    const fetchHandler = (self.addEventListener as jest.Mock).mock.calls
      .find(([event]) => event === 'fetch')[1];

    // Create a mock fetch event
    const mockRequest = new Request('https://example.com');
    const mockEvent = {
      request: mockRequest,
      respondWith: jest.fn()
    } as unknown as FetchEvent;

    // Call the fetch handler
    fetchHandler(mockEvent);
    
    // Wait for promises to resolve
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Should not have called fetch since we got a cache hit
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
