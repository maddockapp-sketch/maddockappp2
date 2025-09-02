
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { TattooArtist } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function BookAppointment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [artists, setArtists] = useState<TattooArtist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<TattooArtist | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await api.get<TattooArtist[]>('/api/artists');
        setArtists(data.filter(a => a.isAvailable));
      } catch (err) {
        setError('Falha ao carregar artistas.');
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  const handleArtistSelect = (artist: TattooArtist) => {
    setSelectedArtist(artist);
    setStep(2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtist || !user) return;
    setSubmitting(true);
    setError('');
    try {
      await api.post('/api/appointments', {
        ...formData,
        artistId: selectedArtist.id,
        clientId: user.id,
      });
      alert('Agendamento solicitado com sucesso! Entraremos em contato para confirmar.');
      navigate('/');
    } catch (err) {
      setError('Falha ao solicitar agendamento. Tente novamente.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  if(loading) return <p>Carregando artistas...</p>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold font-display mb-8">
        {step === 1 ? 'Passo 1: Escolha seu Artista' : `Passo 2: Agendar com ${selectedArtist?.name}`}
      </h1>
      
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map(artist => (
            <div key={artist.id} className="bg-gray-800 rounded-lg p-4 flex flex-col items-center text-center">
              <img src={`https://picsum.photos/seed/${artist.id}/200`} alt={artist.name} className="w-32 h-32 rounded-full mb-4 object-cover" />
              <h3 className="text-xl font-bold font-display">{artist.name}</h3>
              <p className="text-gray-400 mb-4">{artist.specialty}</p>
              <button onClick={() => handleArtistSelect(artist)} className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Selecionar
              </button>
            </div>
          ))}
        </div>
      )}

      {step === 2 && selectedArtist && (
        <div className="bg-gray-800 p-8 rounded-lg">
          <button onClick={() => setStep(1)} className="mb-6 text-indigo-400 hover:text-indigo-300">&larr; Voltar para artistas</button>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Descreva sua ideia</label>
                <textarea id="description" name="description" rows={4} required value={formData.description} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">Data</label>
                    <input type="date" id="date" name="date" required value={formData.date} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-2">Hora</label>
                    <input type="time" id="time" name="time" required value={formData.time} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" disabled={submitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600">
              {submitting ? 'Enviando...' : 'Solicitar Agendamento'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
