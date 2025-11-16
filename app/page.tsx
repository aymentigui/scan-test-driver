'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import QrScanner from '@/components/QrScanner';

interface DriverData {
  matricule: string;
  firstname: string;
  lastname: string;
}

export default function Home() {
  const [scanning, setScanning] = useState(false);
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleScan = async (matricule: string) => {
    setLoading(true);
    setError('');
    setDriverData(null);

    try {
      const response = await fetch(
        `https://dnk.aimen-blog.com/api/test?matricule=${encodeURIComponent(matricule)}`
      );

      if (!response.ok) {
        throw new Error('Erreur réseau');
      }

      const data = await response.json();

      if (data && data.matricule && data.firstname && data.lastname) {
        setDriverData(data);
        setScanning(false);
      } else {
        setError('Aucun conducteur trouvé');
      }
    } catch (err) {
      setError('Aucun conducteur trouvé');
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err: Error) => {
    console.error(err);
    setError('Erreur lors du scan du QR code');
  };

  const resetScanner = () => {
    setScanning(false);
    setDriverData(null);
    setError('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Scanner Conducteur
          </h1>

          {!scanning && !driverData && (
            <button
              onClick={() => setScanning(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition duration-200 shadow-lg hover:shadow-xl"
            >
              📷 Scanner QR Code
            </button>
          )}

          {scanning && (
            <div>
              <QrScanner onScan={handleScan} onError={handleError} />
              <button
                onClick={resetScanner}
                className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-200"
              >
                Annuler
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Vérification en cours...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">❌</span>
                <div>
                  <p className="font-semibold text-red-800">Erreur</p>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={resetScanner}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Réessayer
              </button>
            </div>
          )}

          {driverData && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">✅</span>
                <p className="font-semibold text-green-800 text-lg">
                  Conducteur trouvé
                </p>
              </div>
              <div className="space-y-3 bg-white p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Matricule</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {driverData.matricule}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Prénom</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {driverData.firstname}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Nom</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {driverData.lastname}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setDriverData(null);
                  setScanning(true);
                }}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Scanner un autre code
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}