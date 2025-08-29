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
        <div className="mt-2 w-full flex flex-col items-center bg-white rounded-lg shadow-lg p-2 border border-gray-200">
            <div className="w-full flex items-center justify-between mb-2">
                <p className="text-lg font-bold leading-none text-gray-900">Últimas Coberturas Aprobadas</p>
                <button
                    className="p-2 rounded-full focus:outline-none hover:bg-gray-100 transition border border-gray-300"
                    onClick={() => setShowTable(v => !v)}
                    aria-label={showTable ? 'Ocultar tabla' : 'Mostrar tabla'}
                    style={{ background: 'none', border: 'none' }}
                >
                    {showTable ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                </button>
            </div>
            {showTable && (
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow border border-gray-200">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Cobertura</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Cubierto</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase">Puesto</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase">Motivo</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase">Modalidad</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase">Fecha Solicitud</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ultimasCoberturas.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        No hay coberturas realizadas recientes
                                    </td>
                                </tr>
                            )}
                            {ultimasCoberturas.length > 0 && ultimasCoberturas.map((cobertura, idx) => (
                                <tr key={cobertura.id} className={idx % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "bg-white hover:bg-gray-100"}>
                                    <td className="px-3 py-2 text-sm text-gray-900 border-b border-gray-100">{cobertura.id}</td>
                                    <td className="px-4 py-2 text-sm text-gray-900 border-b border-gray-100">{cobertura.cobertura ? `${cobertura.cobertura.Nombres} ${cobertura.cobertura.Apellidos}` : 'N/A'}</td>
                                    <td className="px-4 py-2 text-sm text-gray-900 border-b border-gray-100">{cobertura.cubierto ? `${cobertura.cubierto.Nombres} ${cobertura.cubierto.Apellidos}` : 'N/A'}</td>
                                    <td className="px-3 py-2 text-sm text-gray-900 border-b border-gray-100">{cobertura.puesto?.Descripcion || 'N/A'}</td>
                                    <td className="px-3 py-2 text-sm text-gray-900 border-b border-gray-100">{cobertura.motivo?.Descripcion || 'N/A'}</td>
                                    <td className="px-3 py-2 text-sm text-gray-900 border-b border-gray-100">{cobertura.modalidad?.Descripcion || 'N/A'}</td>
                                    <td className="px-3 py-2 text-sm text-gray-900 border-b border-gray-100">{cobertura.FechaSolicitud ? new Date(cobertura.FechaSolicitud).toLocaleDateString() : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default React.memo(TablaUltimasCoberturas);