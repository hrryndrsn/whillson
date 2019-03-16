
export interface UserRecord {
  UserId: string
  hillCharts: HilLChart[]
}
export interface HilLChart {
  id :string
  name: string
  points: Pt[]
}

export interface Pt {
  x: number;
  y: number;
  tag: string;
  color: string;
  tagPlacement: number;
}