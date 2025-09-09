"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const getAllTestimonialsForAdmin = async () => {
  try {
    const testimonials = await prisma.testimonials.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        User: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return { success: true, testimonials };
  } catch (error) {
    console.error("Error fetching all testimonials:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener testimoniales",
    };
  }
};

export const approveTestimonial = async (testimonialId: number) => {
  try {
    const testimonial = await prisma.testimonials.update({
      where: { id: testimonialId },
      data: { isApproved: true },
      include: {
        User: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/testimonials");
    revalidatePath("/testimonials");

    return {
      success: true,
      testimonial,
      message: "Testimonial aprobado exitosamente",
    };
  } catch (error) {
    console.error("Error approving testimonial:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al aprobar testimonial",
    };
  }
};

export const rejectTestimonial = async (testimonialId: number) => {
  try {
    const testimonial = await prisma.testimonials.update({
      where: { id: testimonialId },
      data: { isApproved: false },
      include: {
        User: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    revalidatePath("/admin/testimonials");
    revalidatePath("/testimonials");

    return {
      success: true,
      testimonial,
      message: "Testimonial rechazado",
    };
  } catch (error) {
    console.error("Error rejecting testimonial:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al rechazar testimonial",
    };
  }
};

export const deleteTestimonial = async (testimonialId: number) => {
  try {
    await prisma.testimonials.delete({
      where: { id: testimonialId },
    });

    revalidatePath("/admin/testimonials");
    revalidatePath("/testimonials");

    return {
      success: true,
      message: "Testimonial eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al eliminar testimonial",
    };
  }
};

export const getTestimonialStats = async () => {
  try {
    const [total, approved, pending, rejected] = await Promise.all([
      prisma.testimonials.count(),
      prisma.testimonials.count({ where: { isApproved: true } }),
      prisma.testimonials.count({ where: { isApproved: false } }),
      Promise.resolve(0),
    ]);

    return {
      success: true,
      stats: {
        total,
        approved,
        pending,
        rejected,
      },
    };
  } catch (error) {
    console.error("Error fetching testimonial stats:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener estadísticas",
    };
  }
};
