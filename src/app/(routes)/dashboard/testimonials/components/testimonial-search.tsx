"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface TestimonialSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function TestimonialSearch({
  searchTerm,
  onSearchChange,
}: TestimonialSearchProps) {
  return (
    <Card>
      <CardContent className='p-4'>
        <div className='flex items-center space-x-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input
              placeholder='Buscar por nombre, email, empresa o contenido...'
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className='pl-10'
            />
          </div>
          <Button variant='outline' size='sm'>
            <Filter className='h-4 w-4 mr-2' />
            Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
