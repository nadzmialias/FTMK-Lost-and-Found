import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  CheckCircle2,
  FileText,
  HelpCircle,
  MapPin,
  Package,
  ShieldCheck,
  X,
} from "lucide-react";
import { Link } from "react-router";

type FormData = {
  itemName: string;
  category: string;
  location: string;
  dateFound: string;
  description: string;
  keptAt: string;
  verificationQuestion: string;
  verificationAnswer: string;
};

const categories = [
  "Electronics",
  "Cards & Documents",
  "Keys",
  "Bags & Wallets",
  "Clothing & Accessories",
  "Books & Stationery",
  "Personal Items",
  "Others",
];

const locations = [
  "FTMK Computer Lab",
  "FTMK Lecture Hall",
  "FTMK Cafeteria",
  "FTMK Library",
  "FTMK Lobby",
  "FTMK Corridor",
  "FTMK Parking Area",
  "Other Location",
];

const initialFormData: FormData = {
  itemName: "",
  category: "",
  location: "",
  dateFound: "",
  description: "",
  keptAt: "",
  verificationQuestion: "",
  verificationAnswer: "",
};

export default function ReportFoundPage() {
  const [formData, setFormData] = useState<FormData>(
    initialFormData
  );

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    null
  );

  const [submitted, setSubmitted] = useState(false);

  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  // Release temporary image URLs when they are no longer needed
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a JPG, PNG, or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Frontend validation only.
    // Database saving will be implemented in the next phase.

    if (formData.dateFound > localDate) {
      alert("Date found cannot be in the future.");
      return;
    }

    console.log("Validated report data:", {
      ...formData,
      verificationAnswer: "[REDACTED]",
      imageName: image?.name ?? null,
    });

    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setImage(null);
    setImagePreview(null);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <main className="min-h-[80vh] bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2
              size={34}
              className="text-green-600"
            />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Form Validation Successful!
          </h1>

          <p className="mt-3 text-slate-600">
            Your report has passed the frontend validation.
            Database submission will be available after
            Supabase integration.
          </p>

          <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
            This is a development preview.
            Your report has not been saved yet.
          </div>

          <button
            onClick={handleReset}
            className="mt-8 w-full rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Create Another Report
          </button>

          <Link
            to="/"
            className="mt-5 block text-sm font-medium text-slate-500 hover:text-blue-700"
          >
            Back to Homepage
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12">

        {/* Back Navigation */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <Package size={16} />
            Found Item Report
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Report a Found Item
          </h1>

          <p className="mt-3 max-w-2xl text-slate-500">
            Found something at FTMK? Help reunite it with
            its owner by providing some details below.
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="mb-8 flex items-start gap-4 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <ShieldCheck
            size={22}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <div>
            <h3 className="font-semibold text-blue-900">
              Help Keep Items Secure
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-blue-800">
              Avoid sharing sensitive information such as
              student ID numbers, phone numbers, or personal
              details. Keep identifying information private
              so the rightful owner can verify ownership.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">

            {/* SECTION 1 */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-7 py-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <Package
                      size={20}
                      className="text-blue-700"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Item Information
                    </h2>

                    <p className="text-sm text-slate-500">
                      Tell us what you found.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-7">

                {/* Item Name */}
                <div>
                  <label
                    htmlFor="itemName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Item Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="itemName"
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    placeholder="e.g. Scientific Calculator"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select category</option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Item Description <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    maxLength={500}
                    rows={4}
                    placeholder="Briefly describe the item without revealing identifying details..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-right text-xs text-slate-400">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Item Photo{" "}
                    <span className="font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  {!imagePreview ? (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 transition hover:border-blue-300 hover:bg-blue-50">

                      <Camera
                        size={30}
                        className="mb-3 text-slate-400"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        Click to upload a photo
                      </span>

                      <span className="mt-1 text-xs text-slate-400">
                        JPG, PNG or WebP (Max 5MB)
                      </span>

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative overflow-hidden rounded-xl border border-slate-200">
                      <img
                        src={imagePreview}
                        alt="Selected item preview"
                        className="h-60 w-full object-contain bg-slate-100"
                      />

                      <button
                        type="button"
                        onClick={removeImage}
                        aria-label="Remove selected image"
                        className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-600 shadow-sm hover:bg-red-50"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* SECTION 2 */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-7 py-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <MapPin
                      size={20}
                      className="text-blue-700"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Location & Date
                    </h2>

                    <p className="text-sm text-slate-500">
                      Where and when was the item found?
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-7">

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Location Found <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select location</option>

                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label
                    htmlFor="dateFound"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
                  >
                    <CalendarDays size={16} />
                    Date Found <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="dateFound"
                    type="date"
                    name="dateFound"
                    value={formData.dateFound}
                    onChange={handleChange}
                    required
                    max={localDate}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Storage Location */}
                <div>
                  <label
                    htmlFor="keptAt"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Where Is the Item Kept?{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="keptAt"
                    type="text"
                    name="keptAt"
                    value={formData.keptAt}
                    onChange={handleChange}
                    required
                    maxLength={150}
                    placeholder="e.g. FTMK Faculty Office"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Specify a safe collection point. Avoid entering
                    personal contact information.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 3 */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-7 py-6">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <ShieldCheck
                      size={20}
                      className="text-blue-700"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Ownership Verification
                    </h2>

                    <p className="text-sm text-slate-500">
                      Help verify the rightful owner.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-7">

                <div className="rounded-xl bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle
                      size={20}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />

                    <p className="text-sm leading-relaxed text-amber-800">
                      Create a question that only the rightful
                      owner should know. Do not include the
                      answer in the public description.
                    </p>
                  </div>
                </div>

                {/* Question */}
                <div>
                  <label
                    htmlFor="verificationQuestion"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Verification Question{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="verificationQuestion"
                    type="text"
                    name="verificationQuestion"
                    value={formData.verificationQuestion}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    placeholder="e.g. What is the calculator model?"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Answer */}
                <div>
                  <label
                    htmlFor="verificationAnswer"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Expected Answer{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="verificationAnswer"
                    type="password"
                    name="verificationAnswer"
                    value={formData.verificationAnswer}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    autoComplete="off"
                    placeholder="Enter the expected answer"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    This answer will not be shown publicly.
                  </p>
                </div>
              </div>
            </section>

            {/* SUBMISSION */}
            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="mb-6 flex items-start gap-3">
                <FileText
                  size={21}
                  className="mt-0.5 shrink-0 text-blue-700"
                />

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Before You Continue
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    Please review your information carefully.
                    Once database integration is complete,
                    a unique reference code will be generated
                    for your report.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl border border-slate-200 px-7 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Clear Form
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Validate Report
                  <ArrowRight size={18} />
                </button>
              </div>
            </section>
          </div>
        </form>
      </div>
    </main>
  );
}