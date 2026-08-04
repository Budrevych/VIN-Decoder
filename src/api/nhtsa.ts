import { DecodeResponse, VehicleVariable, VariableLookupValue } from '../types/nhtsa';

const BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';

export const decodeVin = async (
  vin: string,
  signal?: AbortSignal
): Promise<DecodeResponse> => {
  const url = `${BASE_URL}/decodevin/${encodeURIComponent(vin)}?format=json`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`NHTSA Server Error (HTTP ${response.status})`);
  }

  const data: DecodeResponse = await response.json();
  return data;
};

let variablesCache: VehicleVariable[] | null = null;

export const getVariableList = async (): Promise<VehicleVariable[]> => {
  if (variablesCache && variablesCache.length > 0) {
    return variablesCache;
  }

  const url = `${BASE_URL}/getvehiclevariablelist?format=json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load vehicle variables list (HTTP ${response.status})`);
  }

  const data = await response.json();
  const results: VehicleVariable[] = data.Results || [];
  variablesCache = results;
  return results;
};

export const getVariableValues = async (
  variableId: number
): Promise<VariableLookupValue[]> => {
  const url = `${BASE_URL}/getvehiclevariablevalueslist/${variableId}?format=json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load lookup values for variable ${variableId}`);
  }

  const data = await response.json();
  return data.Results || [];
};
