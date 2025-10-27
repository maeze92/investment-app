'use client';

import { useState } from 'react';
import { Clock, CalendarPlus, RotateCcw, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format, addDays, addMonths, addYears } from 'date-fns';

interface TimeState {
  simulatedDate: Date | null;
  isActive: boolean;
}

export function TimeSimulator() {
  const [timeState, setTimeState] = useState<TimeState>({
    simulatedDate: null,
    isActive: false,
  });
  const [daysToAdd, setDaysToAdd] = useState<string>('7');
  const [customDate, setCustomDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

  const currentDate = timeState.simulatedDate || new Date();

  const handleSetCustomDate = () => {
    const date = new Date(customDate);
    if (isNaN(date.getTime())) {
      alert('Invalid date format');
      return;
    }

    setTimeState({
      simulatedDate: date,
      isActive: true,
    });
  };

  const handleAdvanceTime = (days: number) => {
    const newDate = addDays(currentDate, days);
    setTimeState({
      simulatedDate: newDate,
      isActive: true,
    });
  };

  const handleAdvanceMonths = (months: number) => {
    const newDate = addMonths(currentDate, months);
    setTimeState({
      simulatedDate: newDate,
      isActive: true,
    });
  };

  const handleAdvanceYears = (years: number) => {
    const newDate = addYears(currentDate, years);
    setTimeState({
      simulatedDate: newDate,
      isActive: true,
    });
  };

  const handleResetTime = () => {
    setTimeState({
      simulatedDate: null,
      isActive: false,
    });
  };

  const formatDateTime = (date: Date) => {
    return format(date, 'dd.MM.yyyy HH:mm:ss');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time Simulator
              </CardTitle>
              <CardDescription>
                Fast-forward time to test notifications and deadlines
              </CardDescription>
            </div>
            {timeState.isActive && (
              <Badge variant="destructive">Simulation Active</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Time Display */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Real Time:</span>
                <span className="text-sm">{formatDateTime(new Date())}</span>
              </div>
              {timeState.isActive && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm font-medium text-orange-600">
                    Simulated Time:
                  </span>
                  <span className="text-sm font-bold text-orange-600">
                    {formatDateTime(currentDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Warning */}
          {timeState.isActive && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Time simulation is active. This affects date calculations, notifications,
                and due date checks. Reset to return to real time.
              </AlertDescription>
            </Alert>
          )}

          {/* Set Custom Date */}
          <div className="space-y-2">
            <Label htmlFor="custom-date">Set Custom Date</Label>
            <div className="flex gap-2">
              <Input
                id="custom-date"
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
              />
              <Button onClick={handleSetCustomDate} variant="secondary">
                Set
              </Button>
            </div>
          </div>

          {/* Quick Time Advance */}
          <div className="space-y-3">
            <Label>Quick Advance</Label>

            {/* Days */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Days</p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => handleAdvanceTime(1)}
                  variant="outline"
                  size="sm"
                >
                  +1 Day
                </Button>
                <Button
                  onClick={() => handleAdvanceTime(7)}
                  variant="outline"
                  size="sm"
                >
                  +7 Days
                </Button>
                <Button
                  onClick={() => handleAdvanceTime(14)}
                  variant="outline"
                  size="sm"
                >
                  +14 Days
                </Button>
                <Button
                  onClick={() => handleAdvanceTime(30)}
                  variant="outline"
                  size="sm"
                >
                  +30 Days
                </Button>
              </div>
            </div>

            {/* Months */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Months</p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => handleAdvanceMonths(1)}
                  variant="outline"
                  size="sm"
                >
                  +1 Month
                </Button>
                <Button
                  onClick={() => handleAdvanceMonths(3)}
                  variant="outline"
                  size="sm"
                >
                  +3 Months
                </Button>
                <Button
                  onClick={() => handleAdvanceMonths(6)}
                  variant="outline"
                  size="sm"
                >
                  +6 Months
                </Button>
              </div>
            </div>

            {/* Years */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Years</p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => handleAdvanceYears(1)}
                  variant="outline"
                  size="sm"
                >
                  +1 Year
                </Button>
                <Button
                  onClick={() => handleAdvanceYears(2)}
                  variant="outline"
                  size="sm"
                >
                  +2 Years
                </Button>
              </div>
            </div>
          </div>

          {/* Custom Days Input */}
          <div className="space-y-2">
            <Label htmlFor="days-input">Custom Days</Label>
            <div className="flex gap-2">
              <Input
                id="days-input"
                type="number"
                value={daysToAdd}
                onChange={(e) => setDaysToAdd(e.target.value)}
                placeholder="Enter days"
                min="1"
              />
              <Button
                onClick={() => handleAdvanceTime(parseInt(daysToAdd) || 0)}
                variant="secondary"
              >
                <CalendarPlus className="h-4 w-4 mr-2" />
                Add Days
              </Button>
            </div>
          </div>

          {/* Reset Button */}
          {timeState.isActive && (
            <Button
              onClick={handleResetTime}
              variant="destructive"
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Real Time
            </Button>
          )}

          {/* Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Usage:</strong> Time simulation affects all date-based features including
              notification triggers, due date checks, and date filters. Use this to test
              payment due notifications, overdue warnings, and month-end processes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
