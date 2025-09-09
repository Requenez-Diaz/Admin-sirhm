import { Star } from "lucide-react";

interface TestimonialRatingProps {
  rating: number;
}

export function TestimonialRating({ rating }: TestimonialRatingProps) {
  return (
    <div className='flex items-center space-x-1'>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
      <span className='text-sm text-muted-foreground ml-1'>({rating})</span>
    </div>
  );
}
