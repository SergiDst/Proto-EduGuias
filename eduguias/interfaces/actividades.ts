export type ActivityType =
    | "cuestionario"
    | "verdadero-falso"
    | "lectura"
    | "video-guia"
    | "union-conceptos";

export type QuestionnaireFeedbackMode = "per-question" | "at-end";
export type QuestionnairePaletteMode = "modo-lectura" | "alto-contraste" | "pastel-suave";
export type QuestionnaireFontFamily = "inter" | "roboto" | "source-sans-3";

export interface QuestionnairePalette {
    fontFamily: QuestionnaireFontFamily;
    titleSize: number;
    subtitleSize: number;
    bodySize: number;
    textColor: string;
    backgroundColor: string;
    mode: QuestionnairePaletteMode;
}

export interface QuestionOption {
    id: string;
    label: string;
    isCorrect: boolean;
}

export interface Question {
    id: string;
    title: string;
    imageUrl?: string;
    imageAlt?: string;
    options: QuestionOption[];
    explanation?: string;
}

export interface CuestionarioPayload {
    activityTitle?: string;
    objective?: string;
    instructions: string;
    questions: Question[];
    feedbackMode: QuestionnaireFeedbackMode;
    showCorrectAnswers: boolean;
    generalMessage?: string;
    palette?: QuestionnairePalette;
}

export interface TrueFalseStatement {
    id: string;
    statement: string;
    isTrue: boolean;
    explanation?: string;
}

export interface VerdaderoFalsoPayload {
    instructions: string;
    statements: TrueFalseStatement[];
    feedbackMode: QuestionnaireFeedbackMode;
    showCorrectAnswers: boolean;
    generalMessage?: string;
}

export type GenericActivityPayload = Record<string, unknown>;

export interface ActivityPayloadMap {
    cuestionario: CuestionarioPayload;
    "verdadero-falso": VerdaderoFalsoPayload;
    lectura: GenericActivityPayload;
    "video-guia": GenericActivityPayload;
    "union-conceptos": GenericActivityPayload;
}

export interface Actividad<TType extends ActivityType = ActivityType> {
    id: string;
    type: TType;
    subject: string;
    title: string;
    score: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    payload?: ActivityPayloadMap[TType];
}

export interface CreateActividadInput<TType extends ActivityType = ActivityType> {
    type: TType;
    subject: string;
    title: string;
    score?: number;
    payload?: ActivityPayloadMap[TType];
}

export type UpdateActividadInput<TType extends ActivityType = ActivityType> = Partial<
    Omit<CreateActividadInput<TType>, "type">
> & {
    type?: TType;
};