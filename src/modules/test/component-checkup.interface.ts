export interface IComponentCheckup {
  testAllComponents(): boolean;
  testComponent(componentName: string): boolean;
  getComponentHealth(componentName: string): 'healthy' | 'warning' | 'critical';
  generateHealthReport(): any;
  schedulePeriodicCheckup(interval: number): void;
  getLastCheckupTime(): Date | null;
}
