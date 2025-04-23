import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function OffertsLoading() {
  return (
    <div>
      <Skeleton className='h-8 w-64 mb-6' />
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-48 mb-2' />
          <Skeleton className='h-4 w-full' />
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-3 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-3 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-3 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-3 w-full' />
            </div>
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-3 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-24 w-full' />
            <Skeleton className='h-3 w-full' />
          </div>
          <Skeleton className='h-10 w-full' />
        </CardContent>
      </Card>
    </div>
  );
}
