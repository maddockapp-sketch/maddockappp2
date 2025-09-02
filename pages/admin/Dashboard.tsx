
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { DollarSign, Users, CalendarCheck, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data - replace with API calls
const totalRevenue = 12540.50;
const pendingAppointments = 8;
const activeArtists = 4;
const recentActivities = [
    { id: 1, text: "Novo agendamento para 'Cliente A' com 'Artista X'" },
    { id:2, text: "Agendamento de 'Cliente B' foi marcado como 'Concluído'"},
    { id:3, text: "'Artista Y' foi adicionado ao estúdio"}
];
const revenueByArtist = [
    { name: 'Artista A', receita: 4000 },
    { name: 'Artista B', receita: 3000 },
    { name: 'Artista C', receita: 2000 },
    { name: 'Artista D', receita: 2780 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold font-display">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-gray-400">+20.1% do último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artistas Ativos</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeArtists}</div>
            <p className="text-xs text-gray-400">Todos disponíveis</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agend. Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAppointments}</div>
            <p className="text-xs text-gray-400">Aguardando confirmação</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos (mês)</CardTitle>
            <CalendarCheck className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+32</div>
             <p className="text-xs text-gray-400">+5 do último mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activities */}
      <div className="grid gap-6 lg:grid-cols-2">
          <Card>
              <CardHeader>
                  <CardTitle>Receita por Artista</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                   <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueByArtist}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af"/>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                            <Legend />
                            <Bar dataKey="receita" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
              </CardContent>
          </Card>
          <Card>
               <CardHeader>
                  <CardTitle>Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                  <ul className="space-y-4">
                      {recentActivities.map(activity => (
                          <li key={activity.id} className="text-sm text-gray-300">{activity.text}</li>
                      ))}
                  </ul>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
