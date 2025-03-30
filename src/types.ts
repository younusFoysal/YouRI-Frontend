export interface Organization {
  _id: string;
  name: string;
  description: string;
  logo: string;
  role: string;
  website: string;
  industry: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  organizationId: string;
  startDate: string;
  endDate?: string;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed';
  budget: number;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  _id: string;
  name: string;
  description: string;
  organizationId: string;
  projectIds: string[];
  leaderId?: string;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId?: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  _id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  avatar: string;
  organizations: UserOrganization[];
  organizationId?: string;
  teamIds?: string[];
  skills?: string[];
  hourlyRate?: number;
  status?: 'active' | 'inactive' | 'on-leave';
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  avatar: string;
  organizations: UserOrganization[];
  skills?: string[];
  hourlyRate?: number;
  status?: 'active' | 'inactive' | 'on-leave';
  token?: string;
  role?: 'MasterAdmin' ;
  isMasterAdmin?: boolean;
}

export interface UserOrganization {
  _id: string;
  organizationId: string;
  role: 'admin' | 'owner' | 'employee';
  joinedAt: string;
  organization?: Organization;
}

export interface WorkSession {
  _id: string;
  employeeId: string;
  projectId?: string;
  taskId?: string;
  startTime: string;
  endTime: string;
  activeTime: number; // in seconds
  idleTime: number; // in seconds
  screenshots: Screenshot[];
  applications: Application[];
  links: Link[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Screenshot {
  _id?: string;
  timestamp: string;
  imageUrl: string;
}

export interface Application {
  _id?: string;
  name: string;
  timeSpent: number;
  icon: string;
}

export interface Link {
  _id?: string;
  url: string;
  title: string;
  timestamp: string;
}

export interface WorkloadData {
  date: string;
  hours: number;
}

export interface DailyStats {
  date: string;
  totalHours: number;
  activeHours: number;
  idleHours: number;
  sessionCount: number;
  sessions: WorkSession[];
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  activeHours: number;
  idleHours: number;
  averageSessionsPerDay: number;
  sessions: WorkSession[];
}

export interface MonthlyStats {
  monthStart: string;
  monthEnd: string;
  totalHours: number;
  activeHours: number;
  idleHours: number;
  totalSessions: number;
  sessions: WorkSession[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}