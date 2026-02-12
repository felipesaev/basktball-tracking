"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GameStatsInput } from "@/components/game-stats-input";
import { Swords, Save, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  GameResult,
  PlayerStats,
  GAME_RESULT_LABELS,
} from "@/lib/types";

export default function NovaRachaPage() {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState(60);
  const [playersNotes, setPlayersNotes] = useState("");
  const [result, setResult] = useState<GameResult>("win");
  const [stats, setStats] = useState<PlayerStats>({
    points: 0,
    assists: 0,
    rebounds: 0,
    steals: 0,
    blocks: 0,
  });
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("pickup_games").insert({
        date,
        location: location || null,
        duration_minutes: duration,
        players_notes: playersNotes || null,
        result,
        ...stats,
        notes: notes || null,
      });

      if (error) throw error;

      setSaved(true);
      setLocation("");
      setDuration(60);
      setPlayersNotes("");
      setResult("win");
      setStats({ points: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0 });
      setNotes("");

      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar racha:", error);
      alert(
        "Erro ao salvar. Verifique se o Supabase esta configurado corretamente."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <Link
          href="/jogos"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <Swords className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Nova Racha</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Registre os detalhes do seu racha
        </p>
      </div>

      <div className="space-y-6">
        {/* Data */}
        <div>
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Local */}
        <div>
          <Label htmlFor="location">Local</Label>
          <Input
            id="location"
            type="text"
            placeholder="Quadra, parque, ginasio..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Duracao */}
        <div>
          <Label htmlFor="duration">Duracao (minutos)</Label>
          <Input
            id="duration"
            type="number"
            min={0}
            max={300}
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
            className="mt-1"
          />
        </div>

        {/* Jogadores */}
        <div>
          <Label htmlFor="players">Jogadores / Times</Label>
          <Textarea
            id="players"
            placeholder="Quem jogou, como foram os times..."
            value={playersNotes}
            onChange={(e) => setPlayersNotes(e.target.value)}
            className="mt-1"
            rows={2}
          />
        </div>

        {/* Resultado */}
        <div>
          <Label className="mb-2 block">Resultado</Label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(GAME_RESULT_LABELS) as GameResult[]).map((r) => (
              <button
                key={r}
                onClick={() => setResult(r)}
                className={`flex items-center justify-center gap-1 rounded-lg border p-3 text-sm font-medium transition-colors ${
                  result === r
                    ? r === "win"
                      ? "border-green-500 bg-green-500/10 text-green-400"
                      : "border-red-500 bg-red-500/10 text-red-400"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {GAME_RESULT_LABELS[r]}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Meus Numeros
          </h2>
          <GameStatsInput stats={stats} onStatsChange={setStats} />
        </div>

        {/* Notas */}
        <div>
          <Label htmlFor="notes">Observacoes</Label>
          <Textarea
            id="notes"
            placeholder="Como foi o jogo? Algo a melhorar?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Botao Salvar */}
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-12 text-base"
          size="lg"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : saved ? (
            "Salvo com sucesso!"
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Racha
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
