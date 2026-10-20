'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { CloudOff, CloudUpload, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

interface FirebaseState {
  connected: boolean;
  projectId: string;
  missingEnv: string[];
  reason: string | null;
  documents: { file: string; inFirebase: boolean; updatedAt: string | null }[];
}

/**
 * Says plainly whether edits are reaching Firebase.
 *
 * Without this the panel could only report that a save "succeeded", which on a
 * read-only serverless deployment can mean it was written to a temporary disk
 * that the next deployment throws away. Firebase is the only store that keeps
 * an edit, so its state belongs on screen rather than in a server log.
 */
export function FirebaseStatus({ onStatus }: { onStatus?: (message: string) => void }) {
  const [state, setState] = useState<FirebaseState | null>(null);
  const [checking, setChecking] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const check = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/admin/firebase');
      setState(await res.json());
    } catch {
      setState({
        connected: false,
        projectId: '',
        missingEnv: [],
        reason: 'Could not reach the server to check Firebase.',
        documents: [],
      });
    }
    setChecking(false);
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const syncAll = async () => {
    setSyncing(true);
    onStatus?.('Pushing every content file to Firebase...');
    try {
      const res = await fetch('/api/admin/firebase', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        onStatus?.(`Pushed ${data.synced} of ${data.total} files to Firebase.`);
      } else if (res.status === 207) {
        onStatus?.(`Pushed ${data.synced} of ${data.total}. Failed: ${data.failed.map((f: any) => f.file).join(', ')}`);
      } else {
        onStatus?.(`Could not push to Firebase: ${data.error}`);
      }
    } catch (err: any) {
      onStatus?.(`Could not push to Firebase: ${err?.message || 'network error'}`);
    }
    setSyncing(false);
    check();
  };

  if (checking && !state) {
    return (
      <div className="mb-6 rounded-xl border border-border-subtle bg-bg-raised px-4 py-3 text-xs text-text-secondary">
        Checking the Firebase connection...
      </div>
    );
  }

  if (!state) return null;

  const missingDocs = state.documents.filter((doc) => !doc.inFirebase);

  return (
    <div
      className={`mb-6 rounded-xl border px-4 py-3 ${
        state.connected
          ? 'border-brand-secondary/30 bg-brand-secondary/5'
          : 'border-brand-primary/40 bg-brand-primary/5'
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          {state.connected ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-secondary" />
          ) : (
            <CloudOff className="h-5 w-5 shrink-0 text-brand-primary" />
          )}
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {state.connected
                ? `Saving to Firebase — project ${state.projectId}`
                : 'Not saving to Firebase'}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              {state.connected ? (
                missingDocs.length > 0 ? (
                  <>
                    {state.documents.length - missingDocs.length} of {state.documents.length} files are
                    in Firebase. {missingDocs.length} have never been pushed.
                  </>
                ) : (
                  <>All {state.documents.length} content files are stored in Firebase.</>
                )
              ) : (
                <>
                  {state.reason} Until this is fixed, edits are only written to this server and will be
                  lost on the next deployment.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={check}
            disabled={checking}
            className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${checking ? 'animate-spin' : ''}`} />
            Re-check
          </button>
          <button
            type="button"
            onClick={syncAll}
            disabled={!state.connected || syncing}
            title={
              state.connected
                ? 'Write every content file to Firebase now'
                : 'Connect Firebase first'
            }
            className="flex items-center gap-1.5 rounded-lg bg-brand-secondary px-3 py-2 text-xs font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CloudUpload className={`h-3.5 w-3.5 ${syncing ? 'animate-pulse' : ''}`} />
            {syncing ? 'Pushing...' : 'Push all to Firebase'}
          </button>
        </div>
      </div>

      {!state.connected && state.missingEnv.length > 0 && (
        <p className="mt-2 flex items-start gap-1.5 text-[11px] text-text-secondary">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-brand-primary" />
          <span>
            Add {state.missingEnv.join(' and ')} to the deployment&apos;s environment variables, then
            redeploy and re-check.
          </span>
        </p>
      )}

      {state.connected && state.documents.length > 0 && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-[11px] font-semibold text-brand-secondary hover:underline"
          >
            {expanded ? 'Hide' : 'Show'} what is stored in Firebase
          </button>
          {expanded && (
            <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {state.documents.map((doc) => (
                <li key={doc.file} className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-mono text-text-secondary">{doc.file}</span>
                  <span className={doc.inFirebase ? 'text-text-muted' : 'text-brand-primary font-semibold'}>
                    {doc.inFirebase
                      ? new Date(doc.updatedAt as string).toLocaleString()
                      : 'never pushed'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
