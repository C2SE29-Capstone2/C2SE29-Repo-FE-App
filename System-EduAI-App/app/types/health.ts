// health.ts

export interface HealthInfoDTO {
  studentId: number;
  bloodType?: string;
  allergies?: string;
  currentWeight?: number;
  currentHeight?: number;
  healthCondition?: string;
  notes?: string;
  medications?: string;
  medicalHistory?: string;
  emergencyContact?: string;
  doctorNotes?: string;
}

export interface GrowthRecordDTO {
  id?: number;
  studentId: number;
  date: string;
  height: number;
  weight: number;
  growthRecordId?: number;
  recordDate?: string;
  notes?: string;
}

export interface CreateHealthReminderDTO {
  title: string;
  content: string;
  type: string;
}

export interface AnnouncementDTO {
  announcementId?: number;
  title: string;
  content: string;
  type: string;
  createdAt?: string;
  studentId?: number;
  classroomId?: number;
}

export interface GrowthChartDataPoint {
  date: string;
  height: number;
  weight: number;
  label?: string;
  value?: number;
}