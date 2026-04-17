import type { BookFilters } from "../types/book";
import FilterDropdown from "./FilterDropdown";

interface AnalysisFiltersProps {
  filters: BookFilters;
  onChange: (filters: BookFilters) => void;
  onApply: () => void;
}

const AnalysisFilters = ({
  filters,
  onChange,
  onApply,
}: AnalysisFiltersProps) => {
  return (
    <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl rounded-xl shadow-sm p-6 mb-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-card-foreground)]">
            Search (Title / Author)
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search books..."
            className="w-full border text-[var(--color-card-foreground)] bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Genre */}
        <FilterDropdown
          label="Genre"
          value={filters.genre}
          options={[
            { label: "All Genres", value: "All" },
            { label: "Fiction", value: "Fiction" },
            { label: "Non-Fiction", value: "Non-Fiction" },
            { label: "Fantasy", value: "Fantasy" },
            { label: "Science", value: "Science" },
          ]}
          onChange={(value) => onChange({ ...filters, genre: value })}
        />

        {/* Rating */}
        <FilterDropdown
          label="Minimum Rating"
          value={filters.minRating}
          options={[
            { label: "Any", value: 0 },
            { label: "4.5+", value: 4.5 },
            { label: "4.0+", value: 4.0 },
            { label: "3.5+", value: 3.5 },
          ]}
          onChange={(value) => onChange({ ...filters, minRating: value })}
        />

        {/* Year */}
        <FilterDropdown
          label="Publication Year"
          value={filters.yearRange}
          options={[
            { label: "All Years", value: "All" },
            { label: "2020+", value: "2020+" },
            { label: "2010–2019", value: "2010-2019" },
            { label: "Before 2010", value: "Before 2010" },
          ]}
          onChange={(value) => onChange({ ...filters, yearRange: value })}
        />

        {/* Apply Button */}
        <div className="flex items-end">
          <button
            onClick={onApply}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </section>
  );
};

export default AnalysisFilters;
