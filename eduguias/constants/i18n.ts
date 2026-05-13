// Lightweight i18n: only what the settings page needs to toggle and persist.
// Other pages can subscribe to the userProfileStore.profile.Idioma to translate.

export type AppLanguage = "es" | "en";

export const LANGUAGES: Record<AppLanguage, { label: string; flag: string }> = {
    es: { label: "Español (ES)", flag: "🇪🇸" },
    en: { label: "English (EN)", flag: "🇺🇸" },
};

export const SETTINGS_TRANSLATIONS = {
    es: {
        title: "Ajustes",
        subtitle: "Personaliza la información de tu perfil y tus preferencias",
        tabProfile: "Perfil",
        tabPreferences: "Preferencias",
        profileTitle: "Información de perfil",
        profileSubtitle: "Actualiza la información de tu cuenta con los datos más recientes.",
        nicknameLabel: "Apodo",
        emailLabel: "Correo electrónico",
        passwordLabel: "Contraseña",
        currentPasswordLabel: "Contraseña actual (para confirmar)",
        newPasswordLabel: "Nueva contraseña",
        saveButton: "Guardar cambios",
        saving: "Guardando…",
        savedNickname: "Apodo actualizado correctamente.",
        savedEmail: "Correo actualizado. Revisa tu bandeja para verificar la nueva dirección.",
        savedPassword: "Contraseña actualizada correctamente.",
        preferencesTitle: "Preferencias",
        preferencesSubtitle: "Configura cómo deben comportarse aspectos específicos de la plataforma",
        languageLabel: "Idioma de la plataforma",
        passwordHelper: "Mínimo 6 caracteres. Te pediremos tu contraseña actual.",
        emailHelper: "Por seguridad, te pediremos tu contraseña actual al cambiar el correo.",
    },
    en: {
        title: "Settings",
        subtitle: "Customize your profile information and preferences",
        tabProfile: "Profile",
        tabPreferences: "Preferences",
        profileTitle: "Profile information",
        profileSubtitle: "Update your account information with the most recent data.",
        nicknameLabel: "Nickname",
        emailLabel: "Email",
        passwordLabel: "Password",
        currentPasswordLabel: "Current password (to confirm)",
        newPasswordLabel: "New password",
        saveButton: "Save changes",
        saving: "Saving…",
        savedNickname: "Nickname updated successfully.",
        savedEmail: "Email updated. Check your inbox to verify the new address.",
        savedPassword: "Password updated successfully.",
        preferencesTitle: "Preferences",
        preferencesSubtitle: "Set how specific aspects of the platform should behave",
        languageLabel: "Platform language",
        passwordHelper: "Minimum 6 characters. We will ask for your current password.",
        emailHelper: "For security, we will ask for your current password when changing the email.",
    },
} as const;
