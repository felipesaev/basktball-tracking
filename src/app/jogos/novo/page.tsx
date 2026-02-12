"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GameStatsInput } from "@/components/game-stats-input";
import { Trophy, Save, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  GameStatus,
  PlayerStats,
  GAME_STATUS_LABELS,
} from "@/lib/types";

export default function NovoJogoOficialPage() {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState("");
  const [opponent, setOpponent] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<GameStatus>("scheduled");
  const [teamScore, setTeamScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [stats, setStats] = useState<PlayerStats>({
    points: 0,
    assists: 0,
    rebounds: 0,
    steals: 0,
    blocks: 0,
  });
  const [minutesPlayed, setMinutesPlayed] = useState(0);
  const [fouls, setFouls] = useState(0);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!opponent.trim()) {
      alert("Informe o nome do time adversario.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("official_games").insert({
        date,
        time: time || null,
        opponent: opponent.trim(),
        location: location || null,
        status,
        team_score: status === "completed" ? teamScore : null,
        opponent_score: status === "completed" ? opponentScore : null,
        ...(status === "completed" ? stats : { points: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0 }),
        minutes_played: status === "completed" ? minutesPlayed : 0,
        fouls: status === "completed" ? fouls : 0,
        notes: notes || null,
      });

      if (error) throw error;

      setSaved(true);
      setOpponent("");
      setLocation("");
      setTime("");
      setStatus("scheduled");
      setTeamScore(0);
      setOpponentScore(0);
      setStats({ points: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0 });
      setMinutesPlayed(0);
      setFouls(0);
      setNotes("");

      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar jogo:", error);
      alert(
        "Erro ao salvar. Verifique se o Supabase esta configurado corretamente."
      );
    } finally {
      setSaving(false);
    }
  };

  const statusColors: Record<GameStatus, string> = {
    scheduled: "border-yellow-500 bg-yellow-500/10 text-yellow-400",
    completed: "border-green-500 bg-green-500/10 text-green-400",
    cancelled: "border-red-500 bg-red-500/10 text-red-400",
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
          <Trophy className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Novo Jogo Oficial</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Agende ou registre um jogo oficial
        </p>
      </div>

      <div className="space-y-6">
        {/* Data e Horario */}
        <div className="grid grid-cols-2 gap-3">
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
          <div>
            <Label htmlFor="time">Horario</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Adversario */}
        <div>
          <Label htmlFor="opponent">Adversario *</Label>
          <Input
            id="opponent"
            type="text"
            placeholder="Nome do time adversario"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Local */}
        <div>
          <Label htmlFor="location">Local</Label>
          <Input
            id="location"
            type="text"
            placeholder="Ginasio, quadra..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Status */}
        <div>
          <Label className="mb-2 block">Status</Label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(GAME_STATUS_LABELS) as GameStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-lg border p-2.5 text-xs font-medium transition-colors ${
                  status === s
                    ? statusColors[s]
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {GAME_STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Placar (so se finalizado) */}
        {status === "completed" && (
          <>
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                Placar Final
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="teamScore">Meu Time</Label>
                  <Input
                    id="teamScore"
                    type="number"
                    min={0}
                    value={teamScore}
                    onChange={(e) => setTeamScore(parseInt(e.target.value) || 0)}
                    className="mt-1 text-center text-lg font-bold"
                  />
                </div>
                <div>
                  <Label htmlFor="opponentScore">Adversario</Label>
                  <Input
                    id="opponentScore"
                    type="number"
                    min={0}
                    value={opponentScore}
                    onChange={(e) =>
                      setOpponentScore(parseInt(e.target.value) || 0)
                    }
                    className="mt-1 text-center text-lg font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Stats pessoais */}
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                Meus Numeros
              </h2>
              <GameStatsInput
                stats={stats}
                onStatsChange={setStats}
                showMinutes
                minutes={minutesPlayed}
                onMinutesChange={setMinutesPlayed}
                showFouls
                fouls={fouls}
                onFoulsChange={setFouls}
              />
            </div>
          </>
        )}

        {/* Notas */}
        <div>
          <Label htmlFor="notes">Observacoes</Label>
          <Textarea
            id="notes"
            placeholder="Observacoes sobre o jogo..."
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
              {status === "scheduled" ? "Agendar Jogo" : "Salvar Jogo"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
