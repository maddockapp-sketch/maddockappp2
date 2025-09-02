
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { Settings } from '../../types';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Partial<Settings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.get<Settings>('/api/settings');
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = (key: keyof Settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/api/settings', settings);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      alert('Falha ao salvar configurações.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) return <p>Carregando configurações...</p>

  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-bold font-display mb-8">Configurações Gerais</h1>
      <div className="bg-gray-800 p-8 rounded-lg space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Habilitar Agendamentos</h3>
            <p className="text-sm text-gray-400">Permitir que clientes solicitem novos agendamentos.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={settings.bookingEnabled ?? false} onChange={() => handleToggle('bookingEnabled')} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Habilitar Chat de Cuidados</h3>
            <p className="text-sm text-gray-400">Ativar o assistente de IA para pós-cuidado.</p>
          </div>
           <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={settings.careChatEnabled ?? false} onChange={() => handleToggle('careChatEnabled')} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="pt-6">
           <button onClick={handleSave} disabled={saving} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600">
             {saving ? 'Salvando...' : 'Salvar Configurações'}
           </button>
        </div>
      </div>
    </div>
  );
}
