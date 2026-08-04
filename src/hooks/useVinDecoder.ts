import { useState, useRef, useEffect, useCallback } from 'react';
import { DecoderState, DecodeResponse, VinHistoryItem } from '../types/nhtsa';
import { decodeVin } from '../api/nhtsa';
import { normalizeVin, validateVin } from '../utils/vin';
import { extractVehicleSummary } from '../utils/extractVehicleSummary';

export const useVinDecoder = (onSuccessSaveHistory?: (item: VinHistoryItem) => void) => {
  const [state, setState] = useState<DecoderState>({ status: 'idle' });
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reference for AbortController to cancel previous inflight requests on new submit
  const controllerRef = useRef<AbortController | null>(null);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  const decode = useCallback(async (vinInput: string) => {
    const vin = normalizeVin(vinInput);

    // Perform client-side validation
    const errorMsg = validateVin(vin);
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }

    setValidationError(null);

    // Abort previous request if still running
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setState({ status: 'loading' });

    try {
      const data: DecodeResponse = await decodeVin(vin, controller.signal);

      // Filter non-empty results
      const filteredResults = (data.Results || []).filter(
        (item) => item.Value !== null && item.Value !== undefined && item.Value.trim() !== ''
      );

      const summary = extractVehicleSummary(filteredResults);

      const historyRecord: VinHistoryItem = {
        vin,
        requestedAt: new Date().toISOString(),
        message: data.Message || '',
        summary,
        results: filteredResults,
      };

      setState({
        status: 'success',
        data: { ...data, Results: filteredResults },
        historyRecord,
      });

      if (onSuccessSaveHistory) {
        onSuccessSaveHistory(historyRecord);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled deliberately, ignore state update
        return;
      }

      const message = err instanceof Error ? err.message : 'An unknown error occurred during request';
      setState({ status: 'error', message });
    }
  }, [onSuccessSaveHistory]);

  const loadFromHistory = useCallback((historyItem: VinHistoryItem) => {
    setValidationError(null);
    setState({
      status: 'success',
      data: {
        Count: historyItem.results.length,
        Message: historyItem.message,
        SearchCriteria: `VIN: ${historyItem.vin}`,
        Results: historyItem.results,
      },
      historyRecord: historyItem,
    });
  }, []);

  const reset = useCallback(() => {
    setValidationError(null);
    setState({ status: 'idle' });
  }, []);

  return {
    state,
    validationError,
    setValidationError,
    decode,
    loadFromHistory,
    reset,
  };
};
