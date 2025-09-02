
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { Appointment } from '../../types';
import { Calendar, MessageCircle, ArrowRight } from 'lucide-react';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (user) {
        try {
          const upcoming = await api.get<Appointment[]>(`/api/appointments?status=confirmed`);
          setAppointments(upcoming.filter(a => new Date(a.date) >= new Date()));
        } catch (error) {
          console.error("Failed to fetch appointments", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAppointments();
  }, [user]);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold font-display">Olá, {user?.name.split(' ')[0]}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/book" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-display">Agendar Tatuagem</h2>
              <p className="text-gray-400">Reserve seu horário com um de nossos artistas.</p>
            </div>
            <Calendar className="h-10 w-10 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </Link>
        <Link to="/care-chat" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-all group">
           <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-display">Chat Pós-Cuidado</h2>
              <p className="text-gray-400">Tire suas dúvidas sobre a cicatrização.</p>
            </div>
            <MessageCircle className="h-10 w-10 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </Link>
      </div>

      <div>
        <h2 className="text-3xl font-bold font-display mb-4">Próximos Agendamentos</h2>
        <div className="bg-gray-800 rounded-lg p-6">
          {loading ? (
            <p>Carregando agendamentos...</p>
          ) : appointments.length > 0 ? (
            <ul className="space-y-4">
              {appointments.map(app => (
                <li key={app.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-md">
                  <div>
                    <p className="font-bold text-lg">{new Date(app.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} às {app.time}</p>
                    <p className="text-gray-400">com {app.artist.name} - Status: <span className="font-semibold text-yellow-400">{app.status}</span></p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-500"/>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Você não possui agendamentos confirmados.</p>
          )}
        </div>
      </div>
    </div>
  );
}
