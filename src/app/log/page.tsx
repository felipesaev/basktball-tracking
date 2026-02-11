"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ShotCounter } from "@/components/shot-counter";
import { ClipboardList, Save, Loader2, Video } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  ShotType,
  Mood,
  SHOT_TYPE_LABELS,
  MOOD_LABELS,
  MOOD_EMOJIS,
} from "@/lib/types";

const SHOT_TYPES: ShotType[] = [
  "free_throw",
  "three_pointer",
  "mid_range",
  "layup",
  "post",
];

export default function LogPage() {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [difficulty, setDifficulty] = useState(3);
  const [duration, setDuration] = useState(60);
  const [mood, setMood] = useState<Mood>("good");
  const [notes, setNotes] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [shots, setShots] = useState<
    Record<ShotType, { made: number; missed: number }>
  >({
    free_throw: { made: 0, missed: 0 },
    three_pointer: { made: 0, missed: 0 },
    mid_range: { made: 0, missed: 0 },
    layup: { made: 0, missed: 0 },
    post: { made: 0, missed: 0 },
  });

  const updateShots = (
    type: ShotType,
    field: "made" | "missed",
    value: number
  ) => {
    setShots((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: session, error: sessionError } = await supabase
        .from("training_sessions")
        .insert({
          date,
          difficulty,
          duration_minutes: duration,
          mood,
          notes: notes || null,
          video_url: videoUrl || null,
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      const shotLogs = SHOT_TYPES.filter(
        (type) => shots[type].made > 0 || shots[type].missed > 0
      ).map((type) => ({
        session_id: session.id,
        shot_type: type,
        made: shots[type].made,
        missed: shots[type].missed,
      }));

      if (shotLogs.length > 0) {
        const { error: shotsError } = await supabase
          .from("shot_logs")
          .insert(shotLogs);
        if (shotsError) throw shotsError;
      }

      setSaved(true);
      // Reset form
      setShots({
        free_throw: { made: 0, missed: 0 },
        three_pointer: { made: 0, missed: 0 },
        mid_range: { made: 0, missed: 0 },
        layup: { made: 0, missed: 0 },
        post: { made: 0, missed: 0 },
      });
      setNotes("");
      setVideoUrl("");
      setDifficulty(3);
      setDuration(60);
      setMood("good");

      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar sessao:", error);
      alert(
        "Erro ao salvar. Verifique se o Supabase esta configurado corretamente."
      );
    } finally {
      setSaving(false);
    }
  };

  const difficultyLabels = ["", "Facil", "Leve", "Medio", "Dificil", "Intenso"];

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Registrar Sessao</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Registre os detalhes do seu treino
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

        {/* Arremessos */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Arremessos
          </h2>
          <div className="space-y-3">
            {SHOT_TYPES.map((type) => (
              <ShotCounter
                key={type}
                label={SHOT_TYPE_LABELS[type]}
                made={shots[type].made}
                missed={shots[type].missed}
                onMadeChange={(v) => updateShots(type, "made", v)}
                onMissedChange={(v) => updateShots(type, "missed", v)}
              />
            ))}
          </div>
        </div>

        {/* Dificuldade */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Dificuldade</Label>
            <span className="text-sm text-muted-foreground">
              {difficultyLabels[difficulty]}
            </span>
          </div>
          <Slider
            value={[difficulty]}
            onValueChange={([v]) => setDifficulty(v)}
            min={1}
            max={5}
            step={1}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-muted-foreground">1</span>
            <span className="text-[10px] text-muted-foreground">5</span>
          </div>
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

        {/* Humor */}
        <div>
          <Label className="mb-2 block">Como voce se sentiu?</Label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(MOOD_LABELS) as Mood[]).map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`flex flex-col items-center gap-1 rounded-lg border p-2.5 text-xs transition-colors ${
                  mood === m
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                <span className="text-lg">{MOOD_EMOJIS[m]}</span>
                <span>{MOOD_LABELS[m]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notas */}
        <div>
          <Label htmlFor="notes">Observacoes</Label>
          <Textarea
            id="notes"
            placeholder="Como foi o treino? Algo a melhorar?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Video */}
        <div>
          <Label htmlFor="video_url" className="flex items-center gap-1.5">
            <Video className="h-3.5 w-3.5" />
            Video do treino
          </Label>
          <Input
            id="video_url"
            type="url"
            placeholder="Cole o link do video (YouTube, Instagram...)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="mt-1"
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
              Salvar Sessao
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
