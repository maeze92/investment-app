'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Investment } from '@/types/entities';
import { formatDate } from '@/lib/utils';
import { INVESTMENT_STATUS_NAMES } from '@/types/enums';

interface InvestmentTimelineProps {
  investment: Investment;
}

interface TimelineEvent {
  date: Date | string;
  type: 'created' | 'submitted' | 'approved' | 'rejected' | 'activated' | 'completed';
  title: string;
  description?: string;
  user?: string;
}

export function InvestmentTimeline({ investment }: InvestmentTimelineProps) {
  // Build timeline events from investment data
  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];

    // Created event
    events.push({
      date: investment.created_at,
      type: 'created',
      title: 'Investition erstellt',
      description: `Status: ${INVESTMENT_STATUS_NAMES[investment.status]}`,
    });

    // Submitted event
    if (investment.submitted_at) {
      events.push({
        date: investment.submitted_at,
        type: 'submitted',
        title: 'Zur Genehmigung eingereicht',
      });
    }

    // Status change events
    if (investment.status === 'genehmigt') {
      events.push({
        date: investment.updated_at || investment.created_at,
        type: 'approved',
        title: 'Genehmigt',
      });
    }

    if (investment.status === 'abgelehnt') {
      events.push({
        date: investment.updated_at || investment.created_at,
        type: 'rejected',
        title: 'Abgelehnt',
      });
    }

    // Sort by date (newest first for timeline display)
    return events.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [investment]);

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'created':
        return 'bg-blue-500';
      case 'submitted':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'activated':
        return 'bg-purple-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zeitlinie / Historie</CardTitle>
      </CardHeader>
      <CardContent>
        {timelineEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">Keine Ereignisse vorhanden.</p>
        ) : (
          <div className="relative space-y-4">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            {timelineEvents.map((event, index) => (
              <div key={index} className="relative flex gap-4">
                {/* Timeline dot */}
                <div
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getEventColor(
                    event.type
                  )}`}
                >
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>

                {/* Event content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{event.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {formatDate(event.date)}
                    </Badge>
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                  {event.user && (
                    <p className="text-xs text-muted-foreground mt-1">Benutzer: {event.user}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
