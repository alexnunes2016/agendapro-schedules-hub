
import { useMemo, useCallback, lazy, useState, useEffect, useRef } from 'react';

// Lazy load pages for better performance
export const LazyDashboard = lazy(() => import('@/pages/Dashboard'));
export const LazyAppointments = lazy(() => import('@/pages/Appointments'));
export const LazyServices = lazy(() => import('@/pages/Services'));
export const LazyClients = lazy(() => import('@/pages/Clients'));
export const LazyMedicalRecords = lazy(() => import('@/pages/MedicalRecords'));
export const LazyAdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
export const LazySystemSettings = lazy(() => import('@/pages/SystemSettings'));
export const LazySettings = lazy(() => import('@/pages/Settings'));

// Debounce hook for search and input optimization
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized hooks for expensive calculations
export const useMemoizedStats = (data: any[]) => {
  return useMemo(() => {
    if (!data || data.length === 0) return null;

    const total = data.length;
    const active = data.filter(item => item.is_active !== false).length;
    const inactive = total - active;

    return {
      total,
      active,
      inactive,
      activePercentage: total > 0 ? Math.round((active / total) * 100) : 0
    };
  }, [data]);
};

export const useMemoizedFilteredData = (data: any[], searchTerm: string, filters: Record<string, any>) => {
  return useMemo(() => {
    if (!data) return [];

    return data.filter(item => {
      // Search term filter
      const matchesSearch = !searchTerm || 
        Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Additional filters
      const matchesFilters = Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue || filterValue === 'all') return true;
        return item[key] === filterValue;
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, searchTerm, filters]);
};

// Optimized callback hooks
export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps);
};

// Virtual scrolling for large lists
export const useVirtualList = (items: any[], itemHeight: number, containerHeight: number) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, items.length);

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
};

// Image optimization utilities
export const optimizeImageUrl = (url: string, width?: number, height?: number): string => {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    
    if (width) urlObj.searchParams.set('w', width.toString());
    if (height) urlObj.searchParams.set('h', height.toString());
    
    return urlObj.toString();
  } catch {
    return url;
  }
};

// Memory cleanup utilities
export const useCleanup = (cleanup: () => void) => {
  const cleanupRef = useRef(cleanup);
  cleanupRef.current = cleanup;

  useEffect(() => {
    return () => cleanupRef.current();
  }, []);
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, options]);

  return isIntersecting;
};

// Request deduplication
export const useRequestDeduplication = () => {
  const requestCache = useRef(new Map<string, Promise<any>>());

  const dedupedRequest = useCallback(async <T>(key: string, requestFn: () => Promise<T>): Promise<T> => {
    if (requestCache.current.has(key)) {
      return requestCache.current.get(key);
    }

    const promise = requestFn();
    requestCache.current.set(key, promise);

    try {
      const result = await promise;
      requestCache.current.delete(key);
      return result;
    } catch (error) {
      requestCache.current.delete(key);
      throw error;
    }
  }, []);

  return dedupedRequest;
};
