import { Receta } from '../rest-clients/recetas.client';
import { Medico } from '../rest-clients/medicos.client';
import { Paciente } from '../rest-clients/pacientes.client';

/**
 * Aggregates receta data and medico data to calculate a KPI.
 * @param recetas - Array of Receta objects.
 * @param medicos - Array of Medico objects.
 * @returns The calculated KPI value.
 */
export function calculateKPI(recetas: Receta[], medicos: Medico[]): number {
    const totalRecetas = recetas.length;
    const totalMedicos = medicos.length;

    if (totalMedicos === 0) return 0;

    return totalRecetas / totalMedicos; // Example KPI: average recetas per medico
}

/**
 * Transforms receta data into a report format.
 * @param recetas - Array of Receta objects.
 * @param pacientes - Array of Paciente objects.
 * @returns A structured report containing receta and paciente information.
 */
export function generateReport(recetas: Receta[], pacientes: Paciente[]): any {
    return {
        totalRecetas: recetas.length,
        totalPacientes: pacientes.length,
        recetasPorPaciente: recetas.length / pacientes.length, // Example metric
        detalles: recetas.map(receta => ({
            id: receta.id,
            pacienteId: receta.pacienteId,
            medicoId: receta.medicoId,
            fecha: receta.fecha,
        })),
    };
}