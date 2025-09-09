import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle } from "lucide-react";

type TestimonialStatus = "pending" | "approved" | "rejected";

interface TestimonialStatusBadgeProps {
  status: TestimonialStatus;
}

export function TestimonialStatusBadge({
  status,
}: TestimonialStatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <Badge variant='secondary' className='bg-yellow-100 text-yellow-800'>
          <Clock className='w-3 h-3 mr-1' />
          Pendiente
        </Badge>
      );
    case "approved":
      return (
        <Badge variant='default' className='bg-green-100 text-green-800'>
          <CheckCircle className='w-3 h-3 mr-1' />
          Aprobado
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant='destructive' className='bg-red-100 text-red-800'>
          <XCircle className='w-3 h-3 mr-1' />
          Rechazado
        </Badge>
      );
  }
}
