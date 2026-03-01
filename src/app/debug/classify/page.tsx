"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, AlertCircle } from "lucide-react";
import type { ClassificationResult } from "@/lib/classify/types";

export default function DebugClassifyPage() {
  const [query, setQuery] = useState("");
  const [labelsStr, setLabelsStr] = useState("");
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const labels = labelsStr.trim()
        ? labelsStr.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined;
      const res = await fetch("/api/debug/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: query.trim(), labels }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Request failed");
      }
      const data: ClassificationResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Debug: Classify</h1>
      <p className="text-muted-foreground mb-6">
        Run the ontology classification engine and see candidates, scores, and reasoning.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="text-sm font-medium mb-1 block">Query</label>
          <Input
            placeholder="e.g. piece of paper, receipt, keys, plastic bag of candy"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">
            Labels (optional, comma-separated, from vision)
          </label>
          <Input
            placeholder="e.g. paper, receipt, white"
            value={labelsStr}
            onChange={(e) => setLabelsStr(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="ml-2">{loading ? "Classifying…" : "Classify"}</span>
        </Button>
      </form>

      {error && (
        <Card className="border-destructive mb-6">
          <CardContent className="pt-6 flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{result.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  confidence: {(result.confidence * 100).toFixed(0)}%
                </span>
              </div>
              {result.conceptId && (
                <p className="text-sm">
                  Concept: <code className="bg-muted px-1 rounded">{result.conceptId}</code>
                  {result.conceptName && ` — ${result.conceptName}`}
                </p>
              )}
            </CardContent>
          </Card>

          {result.topMatches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.topMatches.map((m, i) => (
                    <li
                      key={m.conceptId}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>
                        {i + 1}. <code className="bg-muted px-1 rounded">{m.conceptId}</code>
                        {m.matchType && (
                          <span className="text-muted-foreground ml-2">({m.matchType})</span>
                        )}
                      </span>
                      <Badge variant="outline">{(m.score * 100).toFixed(0)}%</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {result.why.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  {result.why.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {result.doNext.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do next</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  {result.doNext.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {result.followupQuestion && (
            <Card className="border-amber-500/50">
              <CardHeader>
                <CardTitle className="text-lg">Follow-up question</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{result.followupQuestion.question}</p>
                {result.followupQuestion.options?.length && (
                  <ul className="mt-2 list-disc pl-4 text-sm text-muted-foreground">
                    {result.followupQuestion.options.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}

          {result.warnings && result.warnings.length > 0 && (
            <Card className="border-amber-500/50">
              <CardHeader>
                <CardTitle className="text-lg">Warnings</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 text-sm text-amber-700 dark:text-amber-400">
                  {result.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
