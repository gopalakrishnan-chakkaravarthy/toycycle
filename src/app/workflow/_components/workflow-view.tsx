"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getAllPickups } from "../actions";
import { WorkflowTimeline } from "./workflow-timeline";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { DetailedPickup } from "../actions";
import { Loader2 } from "lucide-react";

interface WorkflowViewProps {
  initialPickups: DetailedPickup[];
  initialSearchParams: { [key: string]: string | string[] | undefined };
}

export function WorkflowView({
  initialPickups,
  initialSearchParams,
}: WorkflowViewProps) {
  const searchParams = useSearchParams();
  const [pickups, setPickups] = useState<DetailedPickup[]>(initialPickups);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const params: { [key: string]: string } = {};
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
      const fetchedPickups = await getAllPickups(params);
      setPickups(fetchedPickups);
    });
  }, [searchParams]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle>Pickup History</CardTitle>
          {isPending && <Loader2 className="h-5 w-5 animate-spin" />}
        </div>
        <CardDescription>
          A timeline of donation pickups based on your filters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <WorkflowTimeline pickups={pickups} />
        )}
      </CardContent>
    </Card>
  );
}
