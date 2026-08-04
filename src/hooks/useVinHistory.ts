import { useState, useEffect, useCallback } from 'react';
import { VinHistoryItem } from '../types/nhtsa';

const STORAGE_KEY = 'vin_decoder_recent_history_v1';
const MAX_HISTORY_ITEMS = 3;

export const useVinHistory = () => {
  const [history, setHistory] = useState<VinHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, MAX_HISTORY_ITEMS);
        }
      }
    } catch {
      // Ignore storage read errors
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignore storage write errors (e.g. incognito mode quota limits)
    }
  }, [history]);

  const addHistoryItem = useCallback((newItem: VinHistoryItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.vin !== newItem.vin);
      return [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    history,
    addHistoryItem,
    clearHistory,
  };
};
