'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, ArrowUpDown, BarChart3, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Stat = {
  id: number;
  slug: string;
  title: string;
  category: string | null;
  sort_order: number;
  is_active: boolean;
  total_plays: number;
  plays_30d: number;
  unique_users: number;
  last_played_at: string | null;
};

type SortKey = 'title' | 'total_plays' | 'plays_30d' | 'unique_users' | 'last_played_at';
type SortDir = 'asc' | 'desc';

type Props = {
  adminUid: string;
};

export function ActivacionStatsTable({ adminUid }: Props) {
  const { toast } = useToast();
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('total_plays');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const url = new URL('/api/admin/activaciones/stats', window.location.origin);
        url.searchParams.set('adminUid', adminUid);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Error fetching stats');
        const data: Stat[] = await res.json();
        setStats(data);
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron cargar las estadísticas',
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [adminUid, toast]);

  const sorted = useMemo(() => {
    const copy = [...stats];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      let cmp: number;
      if (typeof av === 'number' && typeof bv === 'number') {
        cmp = av - bv;
      } else {
        cmp = String(av).localeCompare(String(bv));
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [stats, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'title' ? 'asc' : 'desc');
    }
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
    return sortDir === 'asc' ? (
      <ArrowUp className="h-3 w-3 ml-1" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1" />
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Sin activaciones</h3>
          <p className="text-muted-foreground">No hay activaciones registradas todavía.</p>
        </CardContent>
      </Card>
    );
  }

  const totalPlays = stats.reduce((sum, s) => sum + s.total_plays, 0);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> Reproducciones de Activaciones
            </h3>
            <p className="text-sm text-muted-foreground">
              {stats.length} activación{stats.length === 1 ? '' : 'es'} · {totalPlays} reproducción
              {totalPlays === 1 ? '' : 'es'} en total
            </p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 -ml-2"
                  onClick={() => toggleSort('title')}
                >
                  Activación {sortIcon('title')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => toggleSort('total_plays')}
                >
                  Total {sortIcon('total_plays')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => toggleSort('plays_30d')}
                >
                  Últimos 30d {sortIcon('plays_30d')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => toggleSort('unique_users')}
                >
                  Usuarios únicos {sortIcon('unique_users')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 -ml-2"
                  onClick={() => toggleSort('last_played_at')}
                >
                  Última reproducción {sortIcon('last_played_at')}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{s.title}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      {s.category && (
                        <span className="text-xs text-muted-foreground">{s.category}</span>
                      )}
                      {!s.is_active && (
                        <Badge variant="outline" className="text-xs">
                          Inactiva
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">{s.total_plays}</TableCell>
                <TableCell className="text-right">{s.plays_30d}</TableCell>
                <TableCell className="text-right">{s.unique_users}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {s.last_played_at
                    ? new Date(s.last_played_at).toLocaleString('es-MX', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
