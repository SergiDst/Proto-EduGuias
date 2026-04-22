import { CreatePlantillaInput, Plantilla, UpdatePlantillaInput } from "@/services/plantillasServices";

export interface PlantillasStore {
    plantillas: Plantilla[];
    loading: boolean;
    error: string | null;
    fetched: boolean;
    fetchPlantillas: (limitNumber?: number) => Promise<void>;
    createPlantilla: (data: CreatePlantillaInput) => Promise<Plantilla>;
    updatePlantilla: (plantillaId: string, data: UpdatePlantillaInput) => Promise<void>;
    deletePlantilla: (plantillaId: string) => Promise<void>;
    clearError: () => void;
    reset: () => void;
}
