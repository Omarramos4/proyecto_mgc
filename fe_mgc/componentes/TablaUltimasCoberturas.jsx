import React, { useState, useMemo } from 'react';

function TablaUltimasCoberturas({ coberturas = [] }) {
    const [showTable, setShowTable] = useState(false);

    // Filtrar coberturas realizadas y ordenar por fecha descendente
    const ultimasCoberturas = useMemo(() => {
        return coberturas
            .filter(c => {
                if (!c.Estado) return false;
                return c.Estado.toLowerCase() === 'aprobado';
            })
            .filter(c => c.FechaSolicitud)
            .sort((a, b) => new Date(b.FechaSolicitud) - new Date(a.FechaSolicitud))
            .slice(0, 10);
    }, [coberturas]);

    return (
        <div className="mt-2 w-full flex flex-col items-center bg-gray-200 rounded-b-md p-5">
            <div className="w-full flex items-center justify-between mb-2">
                <p className="text-xl font-bold leading-none text-gray-800">Últimas Coberturas Realizadas</p>
                <button
                    className="p-2 rounded focus:outline-none hover:bg-gray-300 transition"
                    onClick={() => setShowTable(v => !v)}
                    aria-label={showTable ? 'Ocultar tabla' : 'Mostrar tabla'}
                    style={{ background: 'none', border: 'none' }}
                >
                    {showTable ? (
                        // Chevron up
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    ) : (
                        // Chevron down
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                </button>
            </div>
            {showTable && (
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 bg-white rounded shadow">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cobertura</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cubierto</th>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Puesto</th>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Modalidad</th>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha Solicitud</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {ultimasCoberturas.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        No hay coberturas realizadas recientes
                                    </td>
                                </tr>
                            ) : (
                                ultimasCoberturas.map(cobertura => (
                                    <tr key={cobertura.id} className="hover:bg-gray-50">
                                        <td className="px-2 py-2 text-sm text-gray-900">{cobertura.id}</td>
                                        <td className="px-3 py-2 text-sm text-gray-900">{cobertura.cobertura ? `${cobertura.cobertura.Nombres} ${cobertura.cobertura.Apellidos}` : 'N/A'}</td>
                                        <td className="px-3 py-2 text-sm text-gray-900">{cobertura.cubierto ? `${cobertura.cubierto.Nombres} ${cobertura.cubierto.Apellidos}` : 'N/A'}</td>
                                        <td className="px-2 py-2 text-sm text-gray-900">{cobertura.puesto?.Descripcion || 'N/A'}</td>
                                        <td className="px-2 py-2 text-sm text-gray-900">{cobertura.motivo?.Descripcion || 'N/A'}</td>
                                        <td className="px-2 py-2 text-sm text-gray-900">{cobertura.modalidad?.Descripcion || 'N/A'}</td>
                                        <td className="px-2 py-2 text-sm text-gray-900">{cobertura.FechaSolicitud ? new Date(cobertura.FechaSolicitud).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default React.memo(TablaUltimasCoberturas);