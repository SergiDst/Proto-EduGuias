export type FirebaseErrorType =
    | 'network'
    | 'permission'
    | 'not-found'
    | 'auth'
    | 'internal'
    | 'invalid-argument'
    | 'resource'
    | 'cancelled'
    | 'unknown';

export type FirebaseErrorAudience = 'user' | 'developer';

interface FirebaseErrorLike {
    code?: unknown;
    message?: unknown;
    name?: unknown;
    stack?: unknown;
}

interface FirebaseErrorDefinition {
    type: FirebaseErrorType;
    userMessage: string;
    devMessage: string;
}

export interface FirebaseErrorInfo {
    code: string;
    normalizedCode: string;
    type: FirebaseErrorType;
    userMessage: string;
    developerMessage: string;
    originalMessage: string;
}

const ERROR_DEFINITIONS: Record<string, FirebaseErrorDefinition> = {
    'firestore/unavailable': {
        type: 'network',
        userMessage: 'Sin conexión a internet. Verifica tu red e intenta nuevamente.',
        devMessage: 'Firestore no disponible o red caída.'
    },
    'firestore/deadline-exceeded': {
        type: 'network',
        userMessage: 'La solicitud tardó demasiado. Intenta nuevamente.',
        devMessage: 'Timeout al consultar Firebase.'
    },
    'firestore/permission-denied': {
        type: 'permission',
        userMessage: 'No tienes permisos para acceder a este contenido.',
        devMessage: 'Reglas de seguridad denegaron la operación.'
    },
    'firestore/not-found': {
        type: 'not-found',
        userMessage: 'El contenido solicitado no está disponible.',
        devMessage: 'Documento o recurso no encontrado en Firestore.'
    },
    'firestore/resource-exhausted': {
        type: 'resource',
        userMessage: 'Se ha excedido el límite de solicitudes. Intenta más tarde.',
        devMessage: 'Cuota/límite de Firebase agotado.'
    },
    'firestore/unauthenticated': {
        type: 'auth',
        userMessage: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
        devMessage: 'Operación sin autenticación válida.'
    },
    'auth/invalid-credential': {
        type: 'auth',
        userMessage: 'Las credenciales de autenticación son incorrectas o expiraron.',
        devMessage: 'Credencial inválida o expirada.'
    },
    'auth/user-not-found': {
        type: 'auth',
        userMessage: 'No existe una cuenta con ese correo electrónico.',
        devMessage: 'Usuario no encontrado en Auth.'
    },
    'auth/wrong-password': {
        type: 'auth',
        userMessage: 'La contraseña es incorrecta.',
        devMessage: 'Contraseña incorrecta.'
    },
    'auth/email-already-in-use': {
        type: 'auth',
        userMessage: 'Ya existe una cuenta con este correo electrónico.',
        devMessage: 'Intento de registro con email duplicado.'
    },
    'auth/weak-password': {
        type: 'auth',
        userMessage: 'La contraseña es muy débil. Debe tener al menos 6 caracteres.',
        devMessage: 'Contraseña no cumple política mínima.'
    },
    'auth/invalid-email': {
        type: 'auth',
        userMessage: 'El formato del correo electrónico no es válido.',
        devMessage: 'Email inválido.'
    },
    'auth/user-disabled': {
        type: 'auth',
        userMessage: 'Esta cuenta ha sido deshabilitada.',
        devMessage: 'Usuario deshabilitado en Auth.'
    },
    'auth/too-many-requests': {
        type: 'auth',
        userMessage: 'Demasiados intentos de inicio de sesión. Intenta más tarde.',
        devMessage: 'Rate limit de autenticación alcanzado.'
    },
    'auth/operation-not-allowed': {
        type: 'auth',
        userMessage: 'Esta operación no está permitida.',
        devMessage: 'Proveedor/método de Auth deshabilitado.'
    },
    'auth/requires-recent-login': {
        type: 'auth',
        userMessage: 'Por seguridad, debes iniciar sesión nuevamente para completar esta acción.',
        devMessage: 'La acción requiere login reciente.'
    },
    'auth/account-exists-with-different-credential': {
        type: 'auth',
        userMessage: 'Esta cuenta existe con un proveedor de inicio de sesión diferente.',
        devMessage: 'Conflicto entre proveedores de autenticación.'
    },
    'auth/credential-already-in-use': {
        type: 'auth',
        userMessage: 'Esta credencial ya está asociada a otra cuenta.',
        devMessage: 'Credencial ya vinculada a otro usuario.'
    },
    'firestore/invalid-argument': {
        type: 'invalid-argument',
        userMessage: 'Los datos enviados no son válidos.',
        devMessage: 'Argumento inválido para la operación de Firestore.'
    },
    'firestore/cancelled': {
        type: 'cancelled',
        userMessage: 'La operación fue cancelada.',
        devMessage: 'Operación cancelada por cliente o servidor.'
    },
    'firestore/internal': {
        type: 'internal',
        userMessage: 'Error interno del servidor. Intenta más tarde.',
        devMessage: 'Error interno reportado por Firestore.'
    },
    'firestore/unknown': {
        type: 'internal',
        userMessage: 'Ocurrió un error inesperado. Intenta más tarde.',
        devMessage: 'Firebase devolvió estado unknown.'
    },
    'auth/internal-error': {
        type: 'internal',
        userMessage: 'Error interno del servidor. Intenta más tarde.',
        devMessage: 'Error interno en Firebase Auth.'
    },
    'firestore/already-exists': {
        type: 'invalid-argument',
        userMessage: 'El contenido ya existe.',
        devMessage: 'Conflicto por recurso existente.'
    },
    'firestore/failed-precondition': {
        type: 'invalid-argument',
        userMessage: 'No se cumplen las condiciones necesarias para esta operación.',
        devMessage: 'Falló una precondición de la operación.'
    },
    'firestore/out-of-range': {
        type: 'invalid-argument',
        userMessage: 'Operación fuera de rango válido.',
        devMessage: 'Parámetro fuera de rango.'
    },
    'firestore/unimplemented': {
        type: 'internal',
        userMessage: 'Esta función no está disponible temporalmente.',
        devMessage: 'La operación no está implementada en el backend.'
    },
    'firestore/data-loss': {
        type: 'internal',
        userMessage: 'Los datos están corruptos o son inválidos.',
        devMessage: 'Firebase reportó data-loss.'
    }
};

const ERROR_ALIASES: Record<string, string> = {
    unavailable: 'firestore/unavailable',
    'deadline-exceeded': 'firestore/deadline-exceeded',
    'permission-denied': 'firestore/permission-denied',
    'not-found': 'firestore/not-found',
    'resource-exhausted': 'firestore/resource-exhausted',
    unauthenticated: 'firestore/unauthenticated',
    'invalid-argument': 'firestore/invalid-argument',
    cancelled: 'firestore/cancelled',
    internal: 'firestore/internal',
    unknown: 'firestore/unknown',
    'already-exists': 'firestore/already-exists',
    'failed-precondition': 'firestore/failed-precondition',
    'out-of-range': 'firestore/out-of-range',
    unimplemented: 'firestore/unimplemented',
    'data-loss': 'firestore/data-loss',
    invalid_login_credentials: 'auth/invalid-credential',
    user_deleted: 'auth/user-not-found',
    invalid_password: 'auth/wrong-password',
    email_exists: 'auth/email-already-in-use',
    weak_password: 'auth/weak-password',
    invalid_email: 'auth/invalid-email',
    user_disabled: 'auth/user-disabled',
    too_many_attempts_try_later: 'auth/too-many-requests',
    operation_not_allowed: 'auth/operation-not-allowed',
    credential_too_old_login_again: 'auth/requires-recent-login',
    need_confirmation: 'auth/account-exists-with-different-credential',
    credential_already_in_use: 'auth/credential-already-in-use',
    internal_error: 'auth/internal-error'
};

const DEFAULT_DEFINITION: FirebaseErrorDefinition = {
    type: 'unknown',
    userMessage: 'Ocurrió un error inesperado. Intenta más tarde.',
    devMessage: 'Error no mapeado en catálogo Firebase.'
};

const toFirebaseErrorLike = (error: unknown): FirebaseErrorLike => {
    if (typeof error === 'object' && error !== null) {
        return error as FirebaseErrorLike;
    }
    return {};
};

const normalizeCode = (rawCode: string): string => {
    if (!rawCode) {
        return '';
    }

    const normalized = rawCode.trim().toLowerCase();
    return ERROR_ALIASES[normalized] ?? normalized;
};

const inferFromMessage = (message: string): FirebaseErrorDefinition => {
    const normalizedMessage = message.toLowerCase();

    if (normalizedMessage.includes('network') || normalizedMessage.includes('internet')) {
        return ERROR_DEFINITIONS['firestore/unavailable'];
    }

    if (normalizedMessage.includes('timeout')) {
        return ERROR_DEFINITIONS['firestore/deadline-exceeded'];
    }

    if (normalizedMessage.includes('permission')) {
        return ERROR_DEFINITIONS['firestore/permission-denied'];
    }

    return DEFAULT_DEFINITION;
};

export const getFirebaseErrorInfo = (error: unknown): FirebaseErrorInfo => {
    const errorLike = toFirebaseErrorLike(error);
    const code = typeof errorLike.code === 'string' ? errorLike.code : '';
    const originalMessage = typeof errorLike.message === 'string' ? errorLike.message : '';
    const normalizedCode = normalizeCode(code);

    const definition =
        ERROR_DEFINITIONS[normalizedCode] ?? inferFromMessage(originalMessage);

    return {
        code,
        normalizedCode,
        type: definition.type,
        userMessage: definition.userMessage,
        developerMessage: `${definition.devMessage} | code=${normalizedCode || 'N/A'} | message=${originalMessage || 'N/A'}`,
        originalMessage
    };
};

export const getFirebaseErrorMessage = (
    error: unknown,
    audience: FirebaseErrorAudience = 'user'
): string => {
    const info = getFirebaseErrorInfo(error);
    return audience === 'developer' ? info.developerMessage : info.userMessage;
};

export const getFirebaseErrorType = (error: unknown): FirebaseErrorType => {
    return getFirebaseErrorInfo(error).type;
};