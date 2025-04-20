'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DetailStepProps {
  certificateDetails: {
    event: string;
    date: string;
    nameColumn: string;
  };
  setCertificateDetails: React.Dispatch<React.SetStateAction<{
    event: string;
    date: string;
    nameColumn: string;
  }>>;
  availableColumns: string[];
}

export function DetailStep({ 
  certificateDetails, 
  setCertificateDetails,
  availableColumns 
}: DetailStepProps) {
  const [date, setDate] = useState<Date | undefined>(
    certificateDetails.date ? new Date(certificateDetails.date) : undefined
  );

  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertificateDetails({ ...certificateDetails, event: e.target.value });
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setCertificateDetails({ 
        ...certificateDetails, 
        date: format(selectedDate, 'MMMM d, yyyy') 
      });
    }
  };

  const handleNameColumnChange = (value: string) => {
    setCertificateDetails({ ...certificateDetails, nameColumn: value });
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Certificate Details</h2>
          <p className="text-muted-foreground">
            Enter the details to include on each certificate.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="event-name">Event/Program Name</Label>
            <Input
              id="event-name"
              placeholder="E.g., Web Development Workshop"
              value={certificateDetails.event}
              onChange={handleEventNameChange}
            />
            <p className="text-xs text-muted-foreground">
              The name of the event, course, or achievement to display on the certificate
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Certificate Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'MMMM d, yyyy') : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              The date to display on the certificate
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name-column">Name Column</Label>
            <Select 
              value={certificateDetails.nameColumn} 
              onValueChange={handleNameColumnChange}
            >
              <SelectTrigger id="name-column">
                <SelectValue placeholder="Select a column" />
              </SelectTrigger>
              <SelectContent>
                {availableColumns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the column from your Excel file that contains recipient names
            </p>
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <h3 className="text-lg font-semibold">Certificate Preview</h3>
          <div className="border rounded-lg p-5 bg-muted flex flex-col items-center justify-center min-h-[200px] text-center space-y-2">
            {certificateDetails.event && certificateDetails.date ? (
              <>
                <p className="text-xl font-semibold">[Recipient Name]</p>
                <p className="text-lg">has successfully completed</p>
                <p className="text-xl font-semibold">{certificateDetails.event}</p>
                <p className="text-sm">on {certificateDetails.date}</p>
              </>
            ) : (
              <p className="text-muted-foreground">Complete the form to see a preview</p>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            This is a text preview. The actual layout depends on your certificate template.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}