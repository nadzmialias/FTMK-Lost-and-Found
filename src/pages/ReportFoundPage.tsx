import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  ImagePlus,
  MapPin,
  PackageCheck,
  Send,
} from "lucide-react";
import {
  getCollectionPoints,
  submitFoundReport,
  type CollectionPoint,
  type FoundReportInput,
  type FoundReportResult,
} from "../services/foundReportService";

const categories = [
  "Electronics", "Accessories", "Documents", "Clothing",
  "Stationery", "Bags", "Keys", "Others",
];

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const initialForm: FoundReportInput = {
  itemName: "",
  category: "",
  description: "",
  location: "",
  itemDate: "",
  collectionPointId: "",
};

interface SelectedPhoto {
  file: File;
  previewUrl: string;
}

export default function ReportFoundPage() {
  const [formData, setFormData] = useState<FoundReportInput>(initialForm);
  const [points, setPoints] = useState<CollectionPoint[]>([]);
  const [photoSelection, setPhotoSelection] = useState<SelectedPhoto | null>(null);
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState<FoundReportResult | null>(null);

  useEffect(() => {
    let active = true;
    getCollectionPoints()
      .then((result) => {
        if (active) setPoints(result);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load collection points.");
        }
      })
      .finally(() => {
        if (active) setLoadingPoints(false);
      });
    return () => { active = false; };
  }, []);

  // The previous preview is released on replacement, removal, and unmount.
  // State is not changed inside this effect, so react-hooks/set-state-in-effect is avoided.
  useEffect(() => {
    return () => {
      if (photoSelection) URL.revokeObjectURL(photoSelection.previewUrl);
    };
  }, [photoSelection]);

  function updateField(field: keyof FoundReportInput, value: string) {
    setFormData((previous) => ({ ...previous, [field]: value }));
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Allows selecting the same file again after removing it.
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }
    if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
      setError("Please choose an image larger than 0 bytes and no more than 3 MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPhotoSelection({ file, previewUrl });
    setError("");
  }

  function removePhoto() {
    setPhotoSelection(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await submitFoundReport(formData, photoSelection?.file ?? null);
      setSubmitted(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit report.");
    } finally {
      setLoading(false);
    }
  }

  const selectedPoint = points.find(
    (point) => point.collection_point_id === formData.collectionPointId
  );

  if (submitted) {
    return (
      <main className="min-h-[75vh] bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <CheckCircle2 size={54} className="mx-auto text-green-600" />
          <h1 className="mt-6 text-2xl font-bold text-slate-900">Report Submitted Successfully!</h1>
          <p className="mt-3 text-slate-500">Your found-item report has been recorded.</p>
          <div className="mt-8 rounded-xl bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your Reference Code</p>
            <p className="mt-2 break-all text-xl font-bold text-blue-700">{submitted.referenceCode}</p>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(submitted.referenceCode);
                  window.alert("Reference code copied.");
                } catch {
                  window.alert("Please select and copy the code manually.");
                }
              }}
              className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-white"
            >
              Copy Reference Code
            </button>
          </div>
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-left">
            <h2 className="flex items-center gap-2 font-semibold text-amber-900">
              <PackageCheck size={20} /> Next Step: Drop Off the Item
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-amber-900">
              Please bring the item to your selected collection point:
            </p>
            <p className="mt-3 font-bold text-amber-950">
              {selectedPoint?.point_name ?? "Selected Collection Point"}
            </p>
            <p className="mt-3 text-sm text-amber-900">
              The item will only be marked as available for collection after an administrator confirms receiving it.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to={`/track/${submitted.referenceCode}`}
              className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Track Report
            </Link>
            <Link
              to="/"
              className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700">
          <ArrowLeft size={18} /> Back to Home
        </Link>
        <div className="mt-8 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <ClipboardList size={16} /> Found Item Report
          </div>
          <h1 className="mt-5 text-3xl font-bold text-slate-900">Report a Found Item</h1>
          <p className="mt-3 text-slate-500">
            Found something at FTMK? Submit the details and deliver the item to a designated collection point.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div>
            <label htmlFor="itemName" className="mb-2 block text-sm font-semibold text-slate-700">Item Name *</label>
            <input id="itemName" required maxLength={150} value={formData.itemName}
              onChange={(e) => updateField("itemName", e.target.value)} placeholder="e.g. Scientific Calculator"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600" />
          </div>
          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-700">Category *</label>
            <select id="category" required value={formData.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600">
              <option value="">Select category</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
            <textarea id="description" rows={4} maxLength={2000} value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe the item without revealing private ownership details."
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600" />
          </div>
          <div>
            <label htmlFor="location" className="mb-2 block text-sm font-semibold text-slate-700">Location Found *</label>
            <input id="location" required maxLength={255} value={formData.location}
              onChange={(e) => updateField("location", e.target.value)} placeholder="e.g. FTMK Computer Lab"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600" />
          </div>
          <div>
            <label htmlFor="itemDate" className="mb-2 block text-sm font-semibold text-slate-700">Date Found *</label>
            <input id="itemDate" type="date" required max={new Date().toLocaleDateString("en-CA")}
              value={formData.itemDate} onChange={(e) => updateField("itemDate", e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600" />
          </div>

          <div>
            <label htmlFor="itemPhoto" className="mb-2 block text-sm font-semibold text-slate-700">Item Photo (Optional)</label>
            <p className="mb-3 text-sm text-slate-500">
              Upload a clear image of the item. JPEG, PNG, or WebP, maximum 3 MB.
              Avoid showing personal information.
            </p>
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-5">
              {photoSelection ? (
                <div className="space-y-4">
                  <img src={photoSelection.previewUrl} alt="Selected item preview"
                    className="mx-auto max-h-64 rounded-lg object-contain" />
                  <p className="truncate text-center text-sm text-slate-600">{photoSelection.file.name}</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <label htmlFor="itemPhoto" className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      Change Photo
                    </label>
                    <button type="button" onClick={removePhoto}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                      Remove Photo
                    </button>
                  </div>
                </div>
              ) : (
                <label htmlFor="itemPhoto" className="flex cursor-pointer flex-col items-center justify-center py-7 text-center">
                  <ImagePlus size={36} className="text-slate-400" />
                  <p className="mt-3 font-semibold text-slate-700">Click to Upload Photo</p>
                  <p className="mt-1 text-xs text-slate-500">JPEG, PNG, or WebP</p>
                </label>
              )}
              <input id="itemPhoto" type="file" accept="image/jpeg,image/png,image/webp"
                className="sr-only" onChange={handlePhotoChange} />
            </div>
          </div>

          <div>
            <label htmlFor="collectionPoint" className="mb-2 block text-sm font-semibold text-slate-700">Intended Collection Point *</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-3.5 text-slate-400" />
              <select id="collectionPoint" required disabled={loadingPoints || points.length === 0}
                value={formData.collectionPointId}
                onChange={(e) => updateField("collectionPointId", e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-blue-600 disabled:bg-slate-50">
                <option value="">{loadingPoints ? "Loading collection points..." : "Select collection point"}</option>
                {points.map((point) => (
                  <option key={point.collection_point_id} value={point.collection_point_id}>{point.point_name}</option>
                ))}
              </select>
            </div>
            {points.length === 0 && !loadingPoints && (
              <p className="mt-2 text-sm text-amber-700">No active collection points are available. Please contact the project administrator.</p>
            )}
            {selectedPoint?.location_description && (
              <p className="mt-2 text-sm text-slate-500">{selectedPoint.location_description}</p>
            )}
          </div>

          {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          <div className="rounded-xl bg-blue-50 p-4 text-sm leading-relaxed text-blue-900">
            <strong>Important:</strong> Submitting a report does not confirm that the item is physically at the collection point. You must hand it to an authorized administrator.
          </div>
          <button type="submit" disabled={loading || loadingPoints || points.length === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-4 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Submitting..." : <><Send size={18} /> Submit Found Item Report</>}
          </button>
        </form>
      </div>
    </main>
  );
}
