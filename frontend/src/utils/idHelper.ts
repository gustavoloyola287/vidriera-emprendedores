export interface EmprendedorLike {
    id?: number | string | null;
    emprendedorId?: number | string | null;
    usuarioId?: number | string | null;
    usuario?: { id?: number | string | null } | null;
    }

    /**
     * Prioriza el ID propio de Emprendedor; si el objeto viene envuelto
     * o con otro nombre de campo, hace fallback controlado y valida que sea numérico.
     */
    export const resolverEmprendedorId = (
    data?: EmprendedorLike | number | string | null
    ): number | null => {
    if (data == null) return null;

    const rawId =
        typeof data === "number" || typeof data === "string"
        ? data
        : data.id ?? data.emprendedorId ?? data.usuario?.id ?? data.usuarioId;

    if (rawId === undefined || rawId === null || rawId === "") return null;

    const parsed = Number(rawId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
    };