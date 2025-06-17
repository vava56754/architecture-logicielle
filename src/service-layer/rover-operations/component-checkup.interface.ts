export interface IComponentCheckup {
  testAllComponents(): boolean;
  testComponent(componentName: string): boolean;
  getComponentHealth(componentName: string): 'healthy' | 'warning' | 'critical';
  generateHealthReport(): {
    timestamp: Date;
    components: Record<string, 'healthy' | 'warning' | 'critical'>;
    overallHealth: 'healthy' | 'unhealthy';
  };
  schedulePeriodicCheckup(interval: number): void;
}
