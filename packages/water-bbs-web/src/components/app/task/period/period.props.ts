export enum PeriodUnit {
  Once = 'Once',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

export type PeriodModelValue = {
  unit: PeriodUnit;
  value: number;
};
