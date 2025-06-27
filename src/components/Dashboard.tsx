
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign, Activity, Clock, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, patients, incidents } = useAuth();

  if (user?.role === 'Patient') {
    const patientIncidents = incidents.filter(i => {
      const patient = patients.find(p => p.id === user.patientId);
      return patient && i.patientId === patient.id;
    });

    const upcomingAppointments = patientIncidents
      .filter(i => new Date(i.appointmentDate) > new Date() && i.status === 'Scheduled')
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());

    const recentTreatments = patientIncidents
      .filter(i => i.status === 'Completed')
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
      .slice(0, 5);

    const totalCost = patientIncidents
      .filter(i => i.cost)
      .reduce((sum, i) => sum + (i.cost || 0), 0);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your dental care overview.</p>
        </div>

        {/* Patient Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Treatments</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentTreatments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Treatment Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCost}</div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled dental appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500">No upcoming appointments scheduled.</p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{incident.title}</h3>
                      <p className="text-sm text-gray-600">{incident.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(incident.appointmentDate).toLocaleDateString()} at{' '}
                        {new Date(incident.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-4">
                      {incident.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Treatments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Treatments</CardTitle>
            <CardDescription>Your completed dental treatments</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTreatments.length === 0 ? (
              <p className="text-gray-500">No completed treatments found.</p>
            ) : (
              <div className="space-y-4">
                {recentTreatments.map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{incident.title}</h3>
                      <p className="text-sm text-gray-600">{incident.treatment}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(incident.appointmentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-2">
                        {incident.status}
                      </Badge>
                      {incident.cost && (
                        <p className="text-sm font-semibold">${incident.cost}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Dashboard
  const upcomingAppointments = incidents
    .filter(i => new Date(i.appointmentDate) > new Date() && i.status === 'Scheduled')
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
    .slice(0, 10);

  const completedTreatments = incidents.filter(i => i.status === 'Completed');
  const pendingTreatments = incidents.filter(i => i.status === 'Scheduled' || i.status === 'Pending');
  const totalRevenue = incidents
    .filter(i => i.cost && i.status === 'Completed')
    .reduce((sum, i) => sum + (i.cost || 0), 0);

  const topPatients = patients
    .map(patient => {
      const patientIncidents = incidents.filter(i => i.patientId === patient.id);
      const totalSpent = patientIncidents
        .filter(i => i.cost && i.status === 'Completed')
        .reduce((sum, i) => sum + (i.cost || 0), 0);
      return { ...patient, totalSpent, treatmentCount: patientIncidents.length };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, Dr. {user?.name}! Here's your practice overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Treatments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTreatments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Treatments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTreatments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Next 10 Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Next 10 Appointments</CardTitle>
            <CardDescription>Upcoming scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500">No upcoming appointments.</p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((incident) => {
                  const patient = patients.find(p => p.id === incident.patientId);
                  return (
                    <div key={incident.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{patient?.name}</h4>
                        <p className="text-sm text-gray-600">{incident.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(incident.appointmentDate).toLocaleDateString()} at{' '}
                          {new Date(incident.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {incident.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Patients */}
        <Card>
          <CardHeader>
            <CardTitle>Top Patients</CardTitle>
            <CardDescription>Patients by total spending</CardDescription>
          </CardHeader>
          <CardContent>
            {topPatients.length === 0 ? (
              <p className="text-gray-500">No patient data available.</p>
            ) : (
              <div className="space-y-4">
                {topPatients.map((patient, index) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{patient.name}</h4>
                        <p className="text-sm text-gray-600">{patient.treatmentCount} treatments</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${patient.totalSpent}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
