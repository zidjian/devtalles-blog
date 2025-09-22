'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ShinyText from '@/components/ShinyText';
import { Heart, FileText, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
    const { data: session } = useSession();
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const defaultStart = firstDay.toISOString().split('T')[0];
    const defaultEnd = lastDay.toISOString().split('T')[0];

    const { register, handleSubmit, reset } = useForm({
        defaultValues: { startDate: defaultStart, endDate: defaultEnd },
    });

    const [totalPosts, setTotalPosts] = useState(0);
    const [totalLikes, setTotalLikes] = useState(0);

    const fetchStats = async (start: string, end: string) => {
        const params = new URLSearchParams();
        if (start) params.append('startDate', start);
        if (end) params.append('endDate', end);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}post/statistics?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
            }
        );
        const data = await response.json();
        setTotalPosts(data.totalPosts);
        setTotalLikes(data.totalLikes);
    };

    useEffect(() => {
        fetchStats(defaultStart, defaultEnd);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    const onSubmit = (data: {
        startDate: string;
        endDate: string;
        action?: string;
    }) => {
        fetchStats(data.startDate, data.endDate);
    };

    return (
        <div className="relative max-w-5xl z-10 min-h-screen pt-40 px-4 py-16 sm:px-6 lg:px-0 mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <ShinyText
                    text="Dashboard"
                    className="text-4xl font-bold text-white mb-4"
                />
                <p className="text-lg text-white/80">
                    Estadísticas y métricas del blog
                </p>
            </div>

            {/* Date Range Filter */}
            <Card className="bg-black/20 backdrop-blur-sm border-white/10 mb-12">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtrar por Rango de Fechas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col sm:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-white mb-2">
                                    Fecha Inicio
                                </label>
                                <input
                                    type="date"
                                    {...register('startDate')}
                                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-white mb-2">
                                    Fecha Fin
                                </label>
                                <input
                                    type="date"
                                    {...register('endDate')}
                                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    reset();
                                    fetchStats(defaultStart, defaultEnd);
                                }}
                                className="text-white border-white/20 hover:bg-white/10">
                                Limpiar
                            </Button>
                            <Button
                                type="submit"
                                variant="outline"
                                name="action"
                                className="text-white border-white/20 hover:bg-white/10">
                                Filtrar
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Total Posts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white mb-2">
                            {totalPosts}
                        </div>
                        <p className="text-white/60">Posts publicados</p>
                    </CardContent>
                </Card>

                <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Heart className="h-5 w-5" />
                            Total Likes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white mb-2">
                            {totalLikes}
                        </div>
                        <p className="text-white/60">Likes totales</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
