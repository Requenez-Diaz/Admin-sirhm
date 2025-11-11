"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { MessageSquare, Loader2 } from "lucide-react";
import { TestimonialSearch } from "./testimonial-search";
import { TestimonialStats } from "./testimonials-stats";
import { TestimonialTable } from "./tables/testimonials-table";
import {
  approveTestimonial,
  deleteTestimonial,
  getAllTestimonialsForAdmin,
  getTestimonialStats,
  rejectTestimonial,
} from "@/app/actions/testimonials/get-all-testimonials";
import { useToast } from "@/components/ui/use-toast";

type _TestimonialStatus = "pending" | "approved" | "rejected";

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  comment: string;
  location: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  bedroomId: number | null;
  userId: number | null;
  isApproved: boolean;
  User?: {
    id: number;
    username: string;
    email: string;
  } | null;
  Bedrooms?: {
    id: number;
    typeBedroom: string;
  } | null;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadTestimonials();
    loadStats();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const result = await getAllTestimonialsForAdmin();
      if (result.success && result.testimonials) {
        // Convertimos createdAt y updatedAt a string
        const mappedTestimonials: Testimonial[] = result.testimonials.map(t => ({
          ...t,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
        }));
        setTestimonials(mappedTestimonials);
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al cargar testimoniales",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar testimoniales",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await getTestimonialStats();
      if (result.success) {
        // Aseguramos que stats siempre tenga un valor
        setStats(result.stats ?? { total: 0, pending: 0, approved: 0, rejected: 0 });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };


  const handleApprove = async (id: number) => {
    try {
      const result = await approveTestimonial(id);
      if (result.success) {
        await loadTestimonials();
        await loadStats();
        toast({
          title: "Testimonial aprobado",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al aprobar testimonial",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al aprobar testimonial",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      const result = await rejectTestimonial(id);
      if (result.success) {
        await loadTestimonials();
        await loadStats();
        toast({
          title: "Testimonial rechazado",
          description: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al rechazar testimonial",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al rechazar testimonial",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteTestimonial(id);
      if (result.success) {
        await loadTestimonials();
        await loadStats();
        toast({
          title: "Testimonial eliminado",
          description: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al eliminar testimonial",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar testimonial",
        variant: "destructive",
      });
    }
  };

  const getFilteredTestimonials = () => {
    let filtered = testimonials;

    // Filter by status
    switch (activeTab) {
      case "pending":
        filtered = filtered.filter((t) => !t.isApproved);
        break;
      case "approved":
        filtered = filtered.filter((t) => t.isApproved);
        break;
      case "rejected":
        // For now, rejected = not approved, but you might want a separate field
        filtered = filtered.filter((t) => !t.isApproved);
        break;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.User?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.User?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className='container mx-auto p-6 flex items-center justify-center min-h-[400px]'>
        <div className='flex items-center gap-2'>
          <Loader2 className='w-6 h-6 animate-spin' />
          <span>Cargando testimoniales...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground flex items-center gap-2'>
            <MessageSquare className='w-8 h-8 text-primary' />
            Gestión de Testimoniales
          </h1>
          <p className='text-muted-foreground mt-2'>
            Administra y modera los testimoniales de usuarios
          </p>
        </div>
      </div>

      <TestimonialStats
        total={stats.total}
        pending={stats.pending}
        approved={stats.approved}
        rejected={stats.rejected}
      />

      <TestimonialSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='all'>Todos ({stats.total})</TabsTrigger>
          <TabsTrigger value='pending'>
            Pendientes ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value='approved'>
            Aprobados ({stats.approved})
          </TabsTrigger>
          <TabsTrigger value='rejected'>
            Rechazados ({stats.rejected})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className='space-y-4'>
          <TestimonialTable
            testimonials={getFilteredTestimonials()}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
            searchTerm={searchTerm}
          />
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  );
}
