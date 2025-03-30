"use client";

import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { getAllBedrooomToPromotions } from "@/app/actions/getPromotions/getAllBedrooms";
import { getAllSeasons } from "@/app/actions/getPromotions/getSeason";
import { Bedroom, Season } from "../type";

export function useOfferFormData() {
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<Bedroom[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Crear una función asíncrona que llama a los server actions
        const fetchServerData = async () => {
          try {
            // Usamos Promise.all para hacer ambas peticiones en paralelo
            const [bedroomsResult, seasonsResult] = await Promise.all([
              getAllBedrooomToPromotions(),

              getAllSeasons(),
            ]);

            console.log("Datos obtenidos - Habitaciones:", bedroomsResult);
            console.log("Datos obtenidos - Temporadas:", seasonsResult);

            return {
              bedrooms: bedroomsResult || [],
              seasons: seasonsResult || [],
            };
          } catch (error) {
            console.error("Error al obtener datos del servidor:", error);
            return { bedrooms: [], seasons: [] };
          }
        };

        // Ejecutar la función
        const data = await fetchServerData();

        // Actualizar los estados con los datos obtenidos
        if (data.bedrooms && data.bedrooms.length > 0) {
          setBedrooms(data.bedrooms);
        }

        if (data.seasons && data.seasons.length > 0) {
          // Convertir las fechas de string a Date si es necesario
          const formattedSeasons = data.seasons.map((season) => ({
            ...season,
            dateStart: new Date(season.dateStart),
            dateEnd: new Date(season.dateEnd),
          }));
          setSeasons(formattedSeasons);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos necesarios.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    selectedSeason,
    setSelectedSeason,
    bedrooms,
    seasons,
    isLoading,
  };
}
