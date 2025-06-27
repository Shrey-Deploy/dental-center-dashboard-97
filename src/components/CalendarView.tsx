
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

const CalendarView: React.FC = () => {
  const { patients, incidents } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDayIncidents, setSelectedDayIncidents] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.name || 'Unknown Patient';
  };

  const getIncidentsForDate = (date: Date) => {
    return incidents.filter(incident => 
      isSameDay(new Date(incident.appointmentDate), date) && 
      (incident.status === 'Scheduled' || incident.status === 'Pending')
    );
  };

  const handleDateClick = (date: Date) => {
    const dayIncidents = getIncidentsForDate(date);
    setSelectedDate(date);
    setSelectedDayIncidents(dayIncidents);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const upcomingAppointments = incidents
    .filter(incident => 
      new Date(incident.appointmentDate) >= new Date() && 
      (incident.status === 'Scheduled' || incident.status === 'Pending')
    )
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
        <p className="text-gray-600 mt-2">Monthly and weekly view of upcoming appointments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {format(currentMonth, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map(day => {
                  const dayIncidents = getIncidentsForDate(day);
                  const hasAppointments = dayIncidents.length > 0;
                  
                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => handleDateClick(day)}
                      className={`
                        min-h-[80px] p-2 border rounded-lg cursor-pointer transition-colors
                        ${isToday(day) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
                        ${hasAppointments ? 'bg-green-50 border-green-200' : ''}
                      `}
                    >
                      <div className="text-sm font-medium mb-1">
                        {format(day, 'd')}
                      </div>
                      {hasAppointments && (
                        <div className="space-y-1">
                          {dayIncidents.slice(0, 2).map(incident => (
                            <div
                              key={incident.id}
                              className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                            >
                              {format(new Date(incident.appointmentDate), 'HH:mm')} - {incident.title}
                            </div>
                          ))}
                          {dayIncidents.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayIncidents.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Next 10 scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.map(incident => (
                    <div key={incident.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{getPatientName(incident.patientId)}</h4>
                        <Badge className={getStatusColor(incident.status)} variant="secondary">
                          {incident.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{incident.title}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(incident.appointmentDate), 'MMM dd, yyyy')} at{' '}
                        {format(new Date(incident.appointmentDate), 'HH:mm')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Day Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Appointments for {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
            </DialogTitle>
            <DialogDescription>
              {selectedDayIncidents.length === 0 
                ? 'No appointments scheduled for this day.' 
                : `${selectedDayIncidents.length} appointment${selectedDayIncidents.length > 1 ? 's' : ''} scheduled.`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedDayIncidents.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No appointments for this day</p>
              </div>
            ) : (
              selectedDayIncidents
                .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
                .map(incident => (
                  <div key={incident.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{incident.title}</h3>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Patient:</p>
                        <p className="font-medium">{getPatientName(incident.patientId)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Time:</p>
                        <p className="font-medium">{format(new Date(incident.appointmentDate), 'HH:mm')}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-600">Description:</p>
                        <p>{incident.description}</p>
                      </div>
                      {incident.comments && (
                        <div className="col-span-2">
                          <p className="text-gray-600">Comments:</p>
                          <p>{incident.comments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;
