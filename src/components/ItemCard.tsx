import { MapPin, CalendarDays, Package } from "lucide-react";
import type { Item } from "../types/item";

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-lg">

      {/* Image */}
      <div className="flex h-44 items-center justify-center bg-slate-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package size={52} className="text-slate-300" />
        )}
      </div>

      <div className="p-6">

        {/* Category and Status */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {item.category}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              item.status === "Reported"
                ? "bg-green-50 text-green-700"
                : item.status === "Returned"
                ? "bg-slate-100 text-slate-600"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {item.status}
          </span>
        </div>

        <h3 className="mb-2 text-lg font-semibold text-slate-900">
          {item.title}
        </h3>

        <p className="mb-5 line-clamp-2 text-sm text-slate-500">
          {item.description}
        </p>

        <div className="space-y-3 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{item.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            <span>{item.date}</span>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="text-sm font-medium text-blue-700">
            Item details coming soon
          </p>
        </div>
      </div>
    </article>
  );
}