
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  role: 'Admin' | 'Patient';
  email: string;
  name?: string;
  patientId?: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  contact: string;
  email?: string;
  healthInfo: string;
}

export interface FileAttachment {
  name: string;
  url: string;
  type: string;
}

export interface Incident {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string;
  cost?: number;
  treatment?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Pending';
  nextDate?: string;
  files: FileAttachment[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  patients: Patient[];
  incidents: Incident[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addIncident: (incident: Omit<Incident, 'id'>) => void;
  updateIncident: (id: string, incident: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_DATA = {
  users: [
    { id: "1", role: "Admin" as const, email: "admin@entnt.in", password: "admin123", name: "Dr. Sarah Wilson" },
    { id: "2", role: "Patient" as const, email: "john@entnt.in", password: "patient123", patientId: "p1", name: "John Doe" },
    { id: "3", role: "Patient" as const, email: "jane@entnt.in", password: "patient123", patientId: "p2", name: "Jane Smith" }
  ],
  patients: [
    {
      id: "p1",
      name: "John Doe",
      dob: "1990-05-10",
      contact: "1234567890",
      email: "john@entnt.in",
      healthInfo: "No known allergies"
    },
    {
      id: "p2",
      name: "Jane Smith",
      dob: "1985-08-22",
      contact: "0987654321",
      email: "jane@entnt.in",
      healthInfo: "Allergic to penicillin"
    },
    {
      id: "p3",
      name: "Mike Johnson",
      dob: "1978-12-15",
      contact: "5555555555",
      email: "mike@entnt.in",
      healthInfo: "Diabetes type 2"
    }
  ],
  incidents: [
    {
      id: "i1",
      patientId: "p1",
      title: "Routine Cleaning",
      description: "6-month dental cleaning and checkup",
      comments: "Good oral hygiene, minor plaque buildup",
      appointmentDate: "2024-12-30T10:00:00",
      cost: 120,
      treatment: "Professional cleaning, fluoride treatment",
      status: "Completed" as const,
      nextDate: "2025-06-30",
      files: []
    },
    {
      id: "i2",
      patientId: "p1",
      title: "Tooth Pain Consultation",
      description: "Patient experiencing pain in upper right molar",
      comments: "Sensitive to cold and pressure",
      appointmentDate: "2025-01-15T14:30:00",
      status: "Scheduled" as const,
      files: []
    },
    {
      id: "i3",
      patientId: "p2",
      title: "Cavity Filling",
      description: "Fill cavity in lower left premolar",
      comments: "Small cavity detected during routine exam",
      appointmentDate: "2025-01-08T09:00:00",
      cost: 180,
      treatment: "Composite filling",
      status: "Completed" as const,
      files: []
    },
    {
      id: "i4",
      patientId: "p2",
      title: "Crown Preparation",
      description: "Prepare tooth for crown placement",
      comments: "Damaged tooth requires crown",
      appointmentDate: "2025-01-20T11:00:00",
      status: "Scheduled" as const,
      files: []
    }
  ]
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    // Initialize data if not exists
    if (!localStorage.getItem('dental_users')) {
      localStorage.setItem('dental_users', JSON.stringify(INITIAL_DATA.users));
    }
    if (!localStorage.getItem('dental_patients')) {
      localStorage.setItem('dental_patients', JSON.stringify(INITIAL_DATA.patients));
      setPatients(INITIAL_DATA.patients);
    } else {
      setPatients(JSON.parse(localStorage.getItem('dental_patients') || '[]'));
    }
    if (!localStorage.getItem('dental_incidents')) {
      localStorage.setItem('dental_incidents', JSON.stringify(INITIAL_DATA.incidents));
      setIncidents(INITIAL_DATA.incidents);
    } else {
      setIncidents(JSON.parse(localStorage.getItem('dental_incidents') || '[]'));
    }

    // Check for existing session
    const savedUser = localStorage.getItem('dental_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('dental_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('dental_current_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dental_current_user');
  };

  const addPatient = (patientData: Omit<Patient, 'id'>) => {
    const newPatient = {
      ...patientData,
      id: `p${Date.now()}`
    };
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    localStorage.setItem('dental_patients', JSON.stringify(updatedPatients));
  };

  const updatePatient = (id: string, patientData: Partial<Patient>) => {
    const updatedPatients = patients.map(p => 
      p.id === id ? { ...p, ...patientData } : p
    );
    setPatients(updatedPatients);
    localStorage.setItem('dental_patients', JSON.stringify(updatedPatients));
  };

  const deletePatient = (id: string) => {
    const updatedPatients = patients.filter(p => p.id !== id);
    const updatedIncidents = incidents.filter(i => i.patientId !== id);
    setPatients(updatedPatients);
    setIncidents(updatedIncidents);
    localStorage.setItem('dental_patients', JSON.stringify(updatedPatients));
    localStorage.setItem('dental_incidents', JSON.stringify(updatedIncidents));
  };

  const addIncident = (incidentData: Omit<Incident, 'id'>) => {
    const newIncident = {
      ...incidentData,
      id: `i${Date.now()}`
    };
    const updatedIncidents = [...incidents, newIncident];
    setIncidents(updatedIncidents);
    localStorage.setItem('dental_incidents', JSON.stringify(updatedIncidents));
  };

  const updateIncident = (id: string, incidentData: Partial<Incident>) => {
    const updatedIncidents = incidents.map(i => 
      i.id === id ? { ...i, ...incidentData } : i
    );
    setIncidents(updatedIncidents);
    localStorage.setItem('dental_incidents', JSON.stringify(updatedIncidents));
  };

  const deleteIncident = (id: string) => {
    const updatedIncidents = incidents.filter(i => i.id !== id);
    setIncidents(updatedIncidents);
    localStorage.setItem('dental_incidents', JSON.stringify(updatedIncidents));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      patients,
      incidents,
      addPatient,
      updatePatient,
      deletePatient,
      addIncident,
      updateIncident,
      deleteIncident
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
