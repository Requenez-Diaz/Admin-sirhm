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
        const fetchServerData = async () => {
          try {
            const [bedroomsResult, seasonsResult] = await Promise.all([
              getAllBedrooomToPromotions(),

              getAllSeasons(),
            ]);
            return {
              bedrooms: bedroomsResult || [],
              seasons: seasonsResult || [],
            };
          } catch (error) {
            return { bedrooms: [], seasons: [] };
          }
        };

        const data = await fetchServerData();

        if (data.bedrooms && data.bedrooms.length > 0) {
          setBedrooms(data.bedrooms);
        }

        if (data.seasons && data.seasons.length > 0) {
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
