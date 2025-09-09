import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import { TestimonialRating } from "../testimonial-ratings";
import { TestimonialStatusBadge } from "../testimonials-status-badge";
import { TestimonialActions } from "../testimonial-actions";

type TestimonialStatus = "pending" | "approved" | "rejected";

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

interface TestimonialTableProps {
  testimonials: Testimonial[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onDelete: (id: number) => void;
  searchTerm?: string;
}

export function TestimonialTable({
  testimonials,
  onApprove,
  onReject,
  onDelete,
  searchTerm,
}: TestimonialTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatus = (testimonial: Testimonial): TestimonialStatus => {
    return testimonial.isApproved ? "approved" : "pending";
  };

  if (testimonials.length === 0) {
    return (
      <Card>
        <div className='p-8 text-center'>
          <MessageSquare className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
          <p className='text-muted-foreground'>
            {searchTerm
              ? "No se encontraron testimoniales que coincidan con tu búsqueda."
              : "No hay testimoniales en esta categoría."}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Calificación</TableHead>
            <TableHead>Testimonial</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className='text-right'>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map((testimonial) => (
            <TableRow key={testimonial.id}>
              <TableCell>
                <div className='flex items-center space-x-3'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage
                      src={testimonial.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className='text-xs'>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium text-sm'>{testimonial.name}</p>
                    {testimonial.User && (
                      <>
                        <p className='text-xs text-muted-foreground'>
                          {testimonial.User.email}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          @{testimonial.User.username}
                        </p>
                      </>
                    )}
                    {testimonial.Bedrooms && (
                      <p className='text-xs text-muted-foreground'>
                        {testimonial.Bedrooms.typeBedroom}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <TestimonialRating rating={testimonial.rating} />
              </TableCell>
              <TableCell className='max-w-md'>
                <p className='text-sm line-clamp-2 text-balance'>
                  {testimonial.comment}
                </p>
              </TableCell>
              <TableCell>
                <p className='text-sm text-muted-foreground'>
                  {testimonial.location}
                </p>
              </TableCell>
              <TableCell>
                <TestimonialStatusBadge status={getStatus(testimonial)} />
              </TableCell>
              <TableCell>
                <p className='text-sm text-muted-foreground'>
                  {formatDate(testimonial.createdAt)}
                </p>
              </TableCell>
              <TableCell className='text-right'>
                <TestimonialActions
                  testimonialId={testimonial.id}
                  status={getStatus(testimonial)}
                  onApprove={onApprove}
                  onReject={onReject}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
