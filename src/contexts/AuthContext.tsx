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
    },
    {
      id: "p4",
      name: "Sarah Williams",
      dob: "1992-03-08",
      contact: "7777777777",
      email: "sarah@entnt.in",
      healthInfo: "No known allergies, wears braces"
    },
    {
      id: "p5",
      name: "Robert Brown",
      dob: "1975-11-25",
      contact: "9999999999",
      email: "robert@entnt.in",
      healthInfo: "High blood pressure, sensitive to anesthesia"
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
      files: [
        { name: "cleaning_invoice.pdf", url: "data:application/pdf;base64,sample", type: "application/pdf" },
        { name: "before_after.jpg", url: "data:image/jpeg;base64,sample", type: "image/jpeg" }
      ]
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
      files: [
        { name: "xray_before.png", url: "data:image/png;base64,sample", type: "image/png" },
        { name: "treatment_notes.pdf", url: "data:application/pdf;base64,sample", type: "application/pdf" }
      ]
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
    },
    {
      id: "i5",
      patientId: "p1",
      title: "Root Canal Treatment",
      description: "Root canal procedure for infected tooth",
      comments: "Severe infection, requires multiple sessions",
      appointmentDate: "2025-06-05T09:00:00",
      cost: 850,
      treatment: "Root canal therapy, temporary filling",
      status: "Completed" as const,
      nextDate: "2025-06-20",
      files: [
        { name: "root_canal_xray.png", url: "data:image/png;base64,sample", type: "image/png" },
        { name: "treatment_plan.pdf", url: "data:application/pdf;base64,sample", type: "application/pdf" },
        { name: "prescription.pdf", url: "data:application/pdf;base64,sample", type: "application/pdf" }
      ]
    },
    {
      id: "i6",
      patientId: "p3",
      title: "Dental Implant Consultation",
      description: "Consultation for dental implant placement",
      comments: "Missing tooth #14, good bone density",
      appointmentDate: "2025-06-10T14:00:00",
      cost: 200,
      treatment: "Consultation, CT scan, treatment planning",
      status: "Completed" as const,
      nextDate: "2025-07-15",
      files: [
        { name: "ct_scan.jpg", url: "data:image/jpeg;base64,sample", type: "image/jpeg" },
        { name: "implant_quote.pdf", url: "data:application/pdf;base64,sample", type: "application/pdf" }
      ]
    },
    {
      id: "i7",
      patientId: "p4",
      title: "Braces Adjustment",
      description: "Monthly braces tightening and adjustment",
      comments: "Good progress, teeth moving as expected",
      appointmentDate: "2025-06-15T16:00:00",
      cost: 150,
      treatment: "Wire adjustment, new rubber bands",
      status: "Completed" as const,
      nextDate: "2025-07-15",
      files: [
        { name: "progress_photos.jpg", url: "data:image/jpeg;base64,sample", type: "image/jpeg" }
      ]
    },
    {
      id: "i8",
      patientId: "p2",
      title: "Wisdom Tooth Extraction",
      description: "Extraction of impacted wisdom tooth",
      comments: "Impacted lower right wisdom tooth causing pain",
      appointmentDate: "2025-06-18T10:30:00",
      cost: 400,
      treatment: "Surgical extraction, stitches",
      status: "Completed" as const,
      files: [
        { name: "pre_extraction_xray.png", url: "data:image/png;base64,sample", type: "image/png" },
        { name: "post_op_instructions.pdf", url: "data:application/pdf;base64,sample", type: "application/pdf" },
        { name: "extraction_invoice.pdf", url: "data:application/pdf;base64,sample", type: "application/pdf" }
      ]
    },
    {
      id: "i9",
      patientId: "p5",
      title: "Routine Checkup",
      description: "6-month routine dental examination",
      comments: "Overall good oral health, minor tartar buildup",
      appointmentDate: "2025-06-22T11:00:00",
      cost: 100,
      treatment: "Examination, cleaning, fluoride treatment",
      status: "Completed" as const,
      nextDate: "2025-12-22",
      files: [
        { name: "checkup_report.pdf", url: "data:application/pdf;base64,sample", type: "application/pdf" }
      ]
    },
    {
      id: "i10",
      patientId: "p1",
      title: "Crown Placement",
      description: "Final crown placement after root canal",
      comments: "Permanent crown placement, good fit",
      appointmentDate: "2025-06-25T13:00:00",
      cost: 1200,
      treatment: "Permanent crown placement, bite adjustment",
      status: "Completed" as const,
      files: [
        { name: "crown_placement_photos.jpg", url: "data:image/jpeg;base64,sample", type: "image/jpeg" },
        { name: "crown_warranty.pdf", url: "data:application/pdf;base64,sample", type: "application/pdf" }
      ]
    },
    {
      id: "i11",
      patientId: "p3",
      title: "Teeth Whitening",
      description: "Professional teeth whitening treatment",
      comments: "Patient wants brighter smile for wedding",
      appointmentDate: "2025-07-03T15:00:00",
      cost: 350,
      treatment: "In-office whitening, custom trays provided",
      status: "Completed" as const,
      files: [
        { name: "before_whitening.jpg", url: "data:image/jpeg;base64,sample", type: "image/jpeg" },
        { name: "after_whitening.jpg", url: "data:image/jpeg;base64,sample", type: "image/jpeg" },
        { name: "whitening_instructions.pdf", url: "data:application/pdf;base64,sample", type: "application/pdf" }
      ]
    },
    {
      id: "i12",
      patientId: "p4",
      title: "Braces Adjustment",
      description: "Monthly orthodontic adjustment",
      comments: "Excellent progress, treatment ahead of schedule",
      appointmentDate: "2025-07-08T16:30:00",
      cost: 150,
      treatment: "Wire change, power chains added",
      status: "Completed" as const,
      nextDate: "2025-08-08",
      files: [
        { name: "orthodontic_progress.jpg", url: "data:image/jpeg;base64,sample", type: "image/jpeg" }
      ]
    },
    {
      id: "i13",
      patientId: "p5",
      title: "Gum Disease Treatment",
      description: "Deep cleaning for periodontal disease",
      comments: "Moderate gum disease, requires scaling and root planing",
      appointmentDate: "2025-07-12T09:30:00",
      cost: 600,
      treatment: "Scaling and root planing, antibiotic therapy",
      status: "Completed" as const,
      nextDate: "2025-08-12",
      files: [
        { name: "periodontal_chart.pdf", url: "data:application/pdf;base64,sample", type: "application/pdf" },
        { name: "gum_photos.jpg", url: "data:image/jpeg;base64,sample", type: "image/jpeg" }
      ]
    },
    {
      id: "i14",
      patientId: "p2",
      title: "Dental Bridge Consultation",
      description: "Consultation for dental bridge to replace missing teeth",
      comments: "Missing teeth affecting chewing, bridge recommended",
      appointmentDate: "2025-07-15T14:00:00",
      cost: 250,
      treatment: "Consultation, impressions, treatment planning",
      status: "Completed" as const,
      nextDate: "2025-08-01",
      files: [
        { name: "bridge_impressions.jpg", url: "data:image/jpeg;base64,sample", type: "image/jpeg" },
        { name: "bridge_treatment_plan.pdf", url: "data:application/pdf;base64,sample", type: "application/pdf" }
      ]
    },
    {
      id: "i15",
      patientId: "p1",
      title: "Follow-up Checkup",
      description: "Follow-up after crown placement",
      comments: "Crown functioning well, patient satisfied",
      appointmentDate: "2025-07-20T10:00:00",
      status: "Scheduled" as const,
      files: []
    },
    {
      id: "i16",
      patientId: "p3",
      title: "Dental Implant Surgery",
      description: "Implant placement surgery",
      comments: "Implant placement for tooth #14",
      appointmentDate: "2025-07-22T08:00:00",
      cost: 2500,
      treatment: "Implant placement, temporary crown",
      status: "Scheduled" as const,
      files: []
    },
    {
      id: "i17",
      patientId: "p4",
      title: "Emergency Visit",
      description: "Broken bracket repair",
      comments: "Bracket came loose during eating",
      appointmentDate: "2025-07-25T13:30:00",
      cost: 75,
      treatment: "Bracket reattachment, wire adjustment",
      status: "Completed" as const,
      files: [
        { name: "broken_bracket_photo.jpg", url: "data:image/jpeg;base64,sample", type: "image/jpeg" }
      ]
    },
    {
      id: "i18",
      patientId: "p5",
      title: "Denture Fitting",
      description: "Partial denture fitting and adjustment",
      comments: "First-time denture wearer, needs adjustment",
      appointmentDate: "2025-07-28T11:30:00",
      cost: 800,
      treatment: "Partial denture delivery, adjustment",
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
