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
  _id: string;
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
  organizationName: string;
  role: 'admin' | 'owner' | 'employee';
  joinedAt: string;
  organization?: Organization;
}

export interface WorkSession {
  _id: string;
  employeeId: string;
  projectId?: Project;
  taskId?: Task;
  startTime: string;
  endTime: string;
  activeTime: number; // in seconds
  idleTime: number | undefined; // in seconds
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

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  selectedOrganization: Organization | null;
}


export type AuthAction =
    | { type: 'LOGIN_REQUEST' }
    | { type: 'LOGIN_SUCCESS'; payload: User }
    | { type: 'LOGIN_FAIL'; payload: string }
    | { type: 'REGISTER_REQUEST' }
    | { type: 'REGISTER_SUCCESS'; payload: User }
    | { type: 'REGISTER_FAIL'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'CLEAR_ERROR' }
    | { type: 'UPDATE_USER'; payload: User }
    | { type: 'SELECT_ORGANIZATION'; payload: Organization };


export interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, position?: string, department?: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (user: User) => void;
  selectOrganization: (organization: Organization) => void;
}

export interface Organization {
  _id: string;
  name: string;
  description: string;
  logo: string;
  industry: string;
  role: string;
}

export interface AddSessionModalProps {
  employeeId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export interface StatisticsProps {
  selectedEmployeeId: string;
  onBack: () => void;
  onViewSession: (session: WorkSession) => void;
}

export type Stats = {
  activeEmployees: number;
  inactiveEmployees: number;
  onLeaveEmployees: number;
  completedProjects: number;
  inProgressProjects: number;
  planningProjects: number;
  onHoldProjects: number;
  todoTasks: number;
  inProgressTasks: number;
  reviewTasks: number;
  completedTasks: number;
  totalBudget: number;
  totalHoursLogged: number;
  activeHours?: number;
  idleHours?: number;
};















