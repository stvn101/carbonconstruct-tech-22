
import { MaterialPerformanceData } from './types';

export const storePerformanceData = async (data: MaterialPerformanceData[], projectId: string): Promise<void> => {
  // Temporary stub - would integrate with database
  console.log('Storing performance data for project:', projectId, data);
};

export const storePerformanceInLocalCache = (data: MaterialPerformanceData[]): void => {
  try {
    localStorage.setItem('material_performance_cache', JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to store performance data in local cache:', error);
  }
};

export const getHistoricalDataForMaterial = async (materialType: string): Promise<any[] | null> => {
  // Temporary stub - would query database
  console.log('Fetching historical data for material:', materialType);
  return null;
};
