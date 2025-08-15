Got it. I’ve added the **minimum** changes so autosave pauses on a successful save and the draft actually clears. I marked changes inline.

```tsx
// src/components/epd/EPDWizard.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { X, ArrowLeft, ArrowRight, CheckCircle, Factory, Truck, Zap, Trash2 } from 'lucide-react';
import type { EPDFormData } from '@/types/epd';
import { EPDService } from '@/services/epdService';
import { toast } from 'sonner';
import { safeLocal } from '@/utils/safeLocal'; // SSR-safe localStorage wrapper
import { useAutosaveDraft } from '@/features/autosave/useAutosaveDraft';

// -------------------------------------------------------------------------------------
// Types & Defaults
// -------------------------------------------------------------------------------------

type StepKey = 'product' | 'manufacture' | 'transport' | 'energy' | 'summary';

const DEFAULT_FORM: EPDFormData = {
  id: undefined,
  name: '',
  description: '',
  productCategory: '',
  // manufacture
  factoryName: '',
  plantLocation: '',
  lineNotes: '',
  // transport
  transportMode: '',
  avgDistanceKm: 0,
  // energy
  electricityKwh: 0,
  gasMj: 0,
  renewablesSharePct: 0,
  // misc
  notes: '',
};

interface EPDWizardProps {
  onClose: () => void;
  initial?: Partial<EPDFormData>;
}

const STEPS: StepKey[] = ['product', 'manufacture', 'transport', 'energy', 'summary'];

// -------------------------------------------------------------------------------------
// Component
// -------------------------------------------------------------------------------------

export default function EPDWizard({ onClose, initial }: EPDWizardProps) {
  // Stable draft id per entity or "new"
  const draftId = useMemo<string>(() => String(initial?.id ?? 'new'), [initial?.id]);

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<EPDFormData>({ ...DEFAULT_FORM, ...initial } as EPDFormData);

  // [ADDED] Track whether autosave should run; turn off right before clearing draft on save.
  const [autosaveEnabled, setAutosaveEnabled] = useState(true); // [ADDED]

  // UX flag to show a one-time "restored" notice
  const restoredOnce = useRef(false);

  // AUTOSAVE: per-tab, restore on reload, clear on successful server save
  const { clearDraft } = useAutosaveDraft<EPDFormData>({
    page: 'epd-create',
    entityId: draftId,
    data: form,
    onRestore: (restored) => {
      // Use the saved payload if it differs from current form
      try {
        const tabId = sessionStorage.getItem('cc-tab-id') ?? '';
        const key = `cc:draft:epd-create:${draftId}:${tabId}`;
        const raw = safeLocal.getItem(key);
        if (!raw) return;

        const saved = JSON.parse(raw);
        const wasDifferent = JSON.stringify(saved) !== JSON.stringify(form);
        if (wasDifferent) {
          setForm(saved);
          if (!restoredOnce.current) {
            restoredOnce.current = true;
            toast.info('Draft restored for this tab.');
          }
        }
      } catch {
        // ignore parse errors
      }
    },
    enabled: autosaveEnabled, // [CHANGED] was true — now respects the toggle
    debounceMs: 800,
  });

  // -----------------------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------------------

  const next = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const prev = () => setStepIndex((i) => Math.max(i - 1, 0));

  const onChange =
    <K extends keyof EPDFormData>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
      setForm((f) => ({ ...f, [key]: value as EPDFormData[K] }));
    };

  const onSelect =
    <K extends keyof EPDFormData>(key: K) =>
    (value: string) =>
      setForm((f) => ({ ...f, [key]: value as EPDFormData[K] }));

  const resetCurrentStep = () => {
    const key = STEPS[stepIndex];
    setForm((f) => {
      const cleared: Partial<EPDFormData> = { ...f };
      if (key === 'product') {
        cleared.name = '';
        cleared.description = '';
        cleared.productCategory = '';
      } else if (key === 'manufacture') {
        cleared.factoryName = '';
        cleared.plantLocation = '';
        cleared.lineNotes = '';
      } else if (key === 'transport') {
        cleared.transportMode = '';
        cleared.avgDistanceKm = 0;
      } else if (key === 'energy') {
        cleared.electricityKwh = 0;
        cleared.gasMj = 0;
        cleared.renewablesSharePct = 0;
      }
      return cleared as EPDFormData;
    });
  };

  // Save (server) → clear local draft on success
  const onSubmit = async () => {// DEV ONLY: bypass backend so we can verify draft-clear without auth
if (import.meta.env.VITE_DEV_MOCK_SAVE === '1') {
  setAutosaveEnabled(false);
  clearDraft();
  toast.success('EPD saved (dev mock).');
  return;
}

    try {
      const saved = await EPDService.createOrUpdate(form);
      // [ADDED] stop autosave before clearing draft so it doesn’t immediately re-write
      setAutosaveEnabled(false); // [ADDED]
      // IMPORTANT: clear local draft now that the source of truth is server-side
      clearDraft(); // merge-critical line (what the conflict was about)
      toast.success('EPD saved successfully.');
      // Replace local form id with server id if needed
      if (saved?.id && !form.id) setForm((f) => ({ ...f, id: saved.id! }));
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to save EPD.');
    }
  };

  // Warn on close if unsaved changes exist (basic heuristic vs DEFAULT_FORM + initial)
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      const baseline = JSON.stringify({ ...DEFAULT_FORM, ...initial });
      const current = JSON.stringify(form);
      if (current !== baseline) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [form, initial]);

  // -----------------------------------------------------------------------------------
  // Render helpers (steps)
  // -----------------------------------------------------------------------------------

  const step = STEPS[stepIndex];

  const StepProduct = () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Product name</Label>
        <Input id="name" value={form.name} onChange={onChange('name')} placeholder="e.g., 32 MPa ready-mix concrete" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="desc">Description</Label>
        <Textarea id="desc" value={form.description} onChange={onChange('description')} placeholder="Short functional description" />
      </div>
      <div className="grid gap-2">
        <Label>Product category</Label>
        <Select value={form.productCategory || ''} onValueChange={onSelect('productCategory')}>
          <SelectTrigger><SelectValue placeholder="Choose a category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="concrete">Concrete</SelectItem>
            <SelectItem value="timber">Timber</SelectItem>
            <SelectItem value="steel">Steel</SelectItem>
            <SelectItem value="aluminium">Aluminium</SelectItem>
            <SelectItem value="insulation">Insulation</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const StepManufacture = () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="factoryName">Factory name</Label>
        <Input id="factoryName" value={form.factoryName} onChange={onChange('factoryName')} placeholder="e.g., Holcim – Wacol Plant" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="plantLocation">Plant location</Label>
        <Input id="plantLocation" value={form.plantLocation} onChange={onChange('plantLocation')} placeholder="City, State" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="lineNotes">Line notes</Label>
        <Textarea id="lineNotes" value={form.lineNotes} onChange={onChange('lineNotes')} placeholder="Batching specifics, admixtures, etc." />
      </div>
    </div>
  );

  const StepTransport = () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Transport mode</Label>
        <Select value={form.transportMode || ''} onValueChange={onSelect('transportMode')}>
          <SelectTrigger><SelectValue placeholder="Choose a mode" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="road">Road</SelectItem>
            <SelectItem value="rail">Rail</SelectItem>
            <SelectItem value="sea">Sea</SelectItem>
            <SelectItem value="air">Air</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="avgDistanceKm">Average distance (km)</Label>
        <Input id="avgDistanceKm" type="number" value={form.avgDistanceKm} onChange={onChange('avgDistanceKm')} min={0} />
      </div>
    </div>
  );

  const StepEnergy = () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="electricityKwh">Electricity (kWh)</Label>
        <Input id="electricityKwh" type="number" value={form.electricityKwh} onChange={onChange('electricityKwh')} min={0} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="gasMj">Gas (MJ)</Label>
        <Input id="gasMj" type="number" value={form.gasMj} onChange={onChange('gasMj')} min={0} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="renewablesSharePct">Renewables share (%)</Label>
        <Input id="renewablesSharePct" type="number" value={form.renewablesSharePct} onChange={onChange('renewablesSharePct')} min={0} max={100} />
      </div>
    </div>
  );

  const StepSummary = () => (
    <div className="grid gap-4">
      <div className="grid gap-1">
        <Label>Overview</Label>
        <div className="text-sm text-muted-foreground">
          Review the details below, then click <b>Save</b>. Your draft will be cleared in this tab after a successful save.
        </div>
      </div>
      <pre className="rounded-lg bg-muted p-4 text-xs overflow-auto">{JSON.stringify(form, null, 2)}</pre>
    </div>
  );

  // -----------------------------------------------------------------------------------
  // UI
  // -----------------------------------------------------------------------------------

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          EPD Wizard
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <Progress value={((stepIndex + 1) / STEPS.length) * 100} className="h-2 w-full" />
          <span className="text-xs text-muted-foreground">
            Step {stepIndex + 1} / {STEPS.length}
          </span>
        </div>

        {restoredOnce.current && (
          <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm">
            Restored unsaved draft for this tab.
          </div>
        )}

        {step === 'product' && (
          <div>
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Factory className="h-4 w-4" /> Product
            </div>
            <StepProduct />
          </div>
        )}

        {step === 'manufacture' && (
          <div>
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Factory className="h-4 w-4" /> Manufacture
            </div>
            <StepManufacture />
          </div>
        )}

        {step === 'transport' && (
          <div>
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" /> Transport
            </div>
            <StepTransport />
          </div>
        )}

        {step === 'energy' && (
          <div>
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" /> Energy
            </div>
            <StepEnergy />
          </div>
        )}

        {step === 'summary' && (
          <div>
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4" /> Summary
            </div>
            <StepSummary />
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <Button variant="outline" onClick={prev} disabled={stepIndex === 0}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button variant="outline" onClick={resetCurrentStep}>
              <Trash2 className="h-4 w-4 mr-1" />
              Clear step
            </Button>
          </div>
          <div className="flex gap-2">
            {stepIndex < STEPS.length - 1 ? (
              <Button onClick={next}>
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={onSubmit}>
                Save
                <CheckCircle className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

When you’re ready for the next step, tell me and I’ll give you **one box with ≤4 commands** to run it and verify the fix.
