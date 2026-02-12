"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy, Swords, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { PickupGame, OfficialGame } from "@/lib/types";
import { PickupGameCard } from "@/components/pickup-game-card";
import { OfficialGameCard } from "@/components/official-game-card";

export default function JogosPage() {
  const [pickupGames, setPickupGames] = useState<PickupGame[]>([]);
  const [officialGames, setOfficialGames] = useState<OfficialGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [pickupRes, officialRes] = await Promise.all([
        supabase
          .from("pickup_games")
          .select("*")
          .order("date", { ascending: false }),
        supabase
          .from("official_games")
          .select("*")
          .order("date", { ascending: false }),
      ]);

      if (pickupRes.error) throw pickupRes.error;
      if (officialRes.error) throw officialRes.error;

      if (pickupRes.data) setPickupGames(pickupRes.data);
      if (officialRes.data) setOfficialGames(officialRes.data);
    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
    } finally {
      setLoading(false);
    }
  }

  const upcomingGames = officialGames.filter((g) => g.status === "scheduled");
  const pastGames = officialGames.filter((g) => g.status !== "scheduled");

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Jogos</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Rachas e jogos oficiais
        </p>
      </div>

      <Tabs defaultValue="rachas">
        <TabsList className="w-full">
          <TabsTrigger value="rachas" className="flex-1">
            <Swords className="h-4 w-4 mr-1.5" />
            Rachas
          </TabsTrigger>
          <TabsTrigger value="oficiais" className="flex-1">
            <Trophy className="h-4 w-4 mr-1.5" />
            Oficiais
          </TabsTrigger>
        </TabsList>

        {/* Tab Rachas */}
        <TabsContent value="rachas">
          <div className="mt-4">
            <Link href="/rachas/novo">
              <Button className="w-full mb-4" size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Nova Racha
              </Button>
            </Link>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 animate-pulse rounded-lg bg-muted"
                  />
                ))}
              </div>
            ) : pickupGames.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <Swords className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium mb-1">Nenhuma racha registrada</h3>
                <p className="text-sm text-muted-foreground">
                  Registre seu primeiro racha para acompanhar seus jogos
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pickupGames.map((game) => (
                  <PickupGameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab Oficiais */}
        <TabsContent value="oficiais">
          <div className="mt-4">
            <Link href="/jogos/novo">
              <Button className="w-full mb-4" size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Novo Jogo Oficial
              </Button>
            </Link>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 animate-pulse rounded-lg bg-muted"
                  />
                ))}
              </div>
            ) : officialGames.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium mb-1">Nenhum jogo oficial</h3>
                <p className="text-sm text-muted-foreground">
                  Agende ou registre seu primeiro jogo oficial
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Proximos jogos */}
                {upcomingGames.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                      Proximos Jogos
                    </h2>
                    <div className="space-y-3">
                      {upcomingGames.map((game) => (
                        <OfficialGameCard key={game.id} game={game} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Jogos anteriores */}
                {pastGames.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                      Jogos Anteriores
                    </h2>
                    <div className="space-y-3">
                      {pastGames.map((game) => (
                        <OfficialGameCard key={game.id} game={game} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
