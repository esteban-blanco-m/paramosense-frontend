export interface SensorReading {
  timestamp: string;
  sensorId: string;
  type: string;
  value: number;
  unit: string;
  status: string;
  statusClass: string;
}

export interface DashboardData {
  syncTime: string;
  userName: string;
  currentDate: string;
  activeSensors: number;
  totalSensors: number;
  criticalAlerts: number;
  inactiveSensors: number;
  sensorHistory: number[];
  waterHistory: number[];
  alertHistory: number[];
  environmentalSummary: {
    temperature: number;
    humidity: number;
    waterLevel: number;
    status: string;
  };
  readings: SensorReading[];
}
