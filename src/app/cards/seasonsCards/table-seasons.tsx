"use client";

import React, { useMemo, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    MoreHorizontal,
    CalendarDays,
    Search,
    RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddSeason } from "./add-season";
import { EditSeason } from "./edit-season";
import { DeleteSeason } from "./delete-season";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { applySeasonToAllBedrooms } from "@/app/actions/seasons/applySeasonToAllBedrooms";

// ─── Main table ───────────────────────────────────────────────────────────────

export default function TableSeasons({ seasons }: { seasons: any[] }) {
    const [search, setSearch] = useState("");
    const [editingSeason, setEditingSeason] = useState<any | null>(null);

    const filtered = useMemo(() => {
        const results = seasons.filter((s) => {
            const matchesSearch =
                s.nameSeason.toLowerCase().includes(search.toLowerCase()) ||
                format(new Date(s.dateStart), "MMMM", { locale: es })
                    .toLowerCase()
                    .includes(search.toLowerCase());
            return matchesSearch;
        });

        results.sort((a, b) => {
            const aStart = new Date(a.dateStart).getTime();
            const bStart = new Date(b.dateStart).getTime();
            if (aStart !== bStart) return aStart - bStart;
            const aEnd = new Date(a.dateEnd).getTime();
            const bEnd = new Date(b.dateEnd).getTime();
            return aEnd - bEnd;
        });

        return results;
    }, [seasons, search]);

    return (
        <div className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative flex-1 w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por tipo o mes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <AddSeason seasons={seasons} />
            </div>

            <div className="rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Temporada</TableHead>
                            <TableHead>Fecha Inicio</TableHead>
                            <TableHead>Fecha Fin</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length > 0 ? (
                            filtered.map((season) => (
                                <SeasonRow
                                    key={season.id}
                                    season={season}
                                    onEdit={() => setEditingSeason(season)}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No se encontraron temporadas.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Controlled Dialog outside DropdownMenu to avoid calendar close issues */}
            {editingSeason && (
                <EditSeason
                    season={editingSeason}
                    seasons={seasons}
                    open={!!editingSeason}
                    onOpenChange={(open) => !open && setEditingSeason(null)}
                    showTrigger={false}
                />
            )}
        </div>
    );
}

// ─── Season Row ───────────────────────────────────────────────────────────────

function SeasonRow({ season, onEdit }: { season: any; onEdit: () => void }) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleApply = async () => {
        setLoading(true);
        const result = await applySeasonToAllBedrooms(season.id);
        setLoading(false);
        setConfirmOpen(false);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <>
            <TableRow className="hover:bg-muted/30 transition-colors">
                <TableCell>
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <Badge
                            variant={season.nameSeason === "ALTA" ? "default" : "secondary"}
                            className="ml-2"
                        >
                            {season.nameSeason}
                        </Badge>
                    </div>
                </TableCell>
                <TableCell>
                    {format(new Date(season.dateStart), "dd 'de' MMMM, yyyy", { locale: es })}
                </TableCell>
                <TableCell>
                    {format(new Date(season.dateEnd), "dd 'de' MMMM, yyyy", { locale: es })}
                </TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuLabel>Opciones</DropdownMenuLabel>

                            <DropdownMenuItem onClick={onEdit}>
                                <div className="flex items-center gap-2">
                                    <MoreHorizontal className="w-4 h-4" />
                                    Editar
                                </div>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => setConfirmOpen(true)}
                                className="flex items-center gap-2 text-blue-600 focus:text-blue-600"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Aplicar a todas las hab.
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="p-0"
                            >
                                <DeleteSeason seasonId={season.id} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>

            {/* Confirmation dialog for bulk apply */}
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Aplicar temporada a todas las habitaciones?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción asignará la temporada{" "}
                            <span className="font-semibold">
                                {season.nameSeason === "ALTA" ? "Alta" : "Baja"}
                            </span>{" "}
                            ({format(new Date(season.dateStart), "dd/MM/yyyy")} –{" "}
                            {format(new Date(season.dateEnd), "dd/MM/yyyy")}) a{" "}
                            <span className="font-semibold">todas las habitaciones</span>.
                            Esto reemplazará la temporada activa de cada una de ellas.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleApply} disabled={loading}>
                            {loading ? "Aplicando..." : "Sí, aplicar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
