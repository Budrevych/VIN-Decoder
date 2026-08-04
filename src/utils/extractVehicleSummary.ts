import { NhtsaResult, VehicleSummary } from '../types/nhtsa';

/**
 * Extracts key vehicle attributes from NHTSA results array
 * to populate the primary Summary Card.
 */
export const extractVehicleSummary = (results: NhtsaResult[]): VehicleSummary => {
  const findValue = (varName: string): string | undefined => {
    const found = results.find(
      (item) => item.Variable && item.Variable.toLowerCase() === varName.toLowerCase()
    );
    return found && found.Value && found.Value.trim() !== '' ? found.Value : undefined;
  };

  return {
    make: findValue('Make'),
    model: findValue('Model'),
    modelYear: findValue('Model Year'),
    vehicleType: findValue('Vehicle Type'),
    plantCountry: findValue('Plant Country'),
    manufacturer: findValue('Manufacturer Name'),
  };
};
