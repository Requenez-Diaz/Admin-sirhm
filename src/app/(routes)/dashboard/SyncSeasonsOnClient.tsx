"use client";

import { useEffect } from "react";
import { applyActiveSeasonToBedrooms } from "@/app/actions/seasons/applyActiveSeasonToBedrooms";

export default function SyncSeasonsOnClient() {
  useEffect(() => {
    (async () => {
      try {
        // call server action to sync seasons; result not required on client
        await applyActiveSeasonToBedrooms();
      } catch (e) {
        // swallow errors; optionally report to client-side logger
        console.error("Error sincronizando temporadas (cliente):", e);
      }
    })();
  }, []);

  return null;
}
