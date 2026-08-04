// Single result item returned inside NHTSA decodevin Results array
export interface NhtsaResult {
  Variable: string;
  VariableId: number;
  Value: string | null;
  ValueId: string | null;
}

// Complete API response structure from /vehicles/decodevin/{vin}?format=json
export interface DecodeResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: NhtsaResult[];
}

// Single vehicle variable structure from /vehicles/getvehiclevariablelist
export interface VehicleVariable {
  DataType: string;
  Description: string;
  GroupName: string | null;
  ID: number;
  Name: string;
}

// Lookup value option structure from /vehicles/getvehiclevariablevalueslist/{id}
export interface VariableLookupValue {
  ElementName: string;
  Id: number;
  Name: string;
}

// Key vehicle attributes summary card model
export interface VehicleSummary {
  make?: string;
  model?: string;
  modelYear?: string;
  vehicleType?: string;
  plantCountry?: string;
  manufacturer?: string;
}

// LocalStorage history item model (stores filtered non-empty results)
export interface VinHistoryItem {
  vin: string;
  requestedAt: string; // ISO string timestamp
  message: string;
  summary: VehicleSummary;
  results: NhtsaResult[]; // Only results where Value != null
}

// Discriminated union for UI state
export type DecoderState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: DecodeResponse; historyRecord: VinHistoryItem }
  | { status: 'error'; message: string };
