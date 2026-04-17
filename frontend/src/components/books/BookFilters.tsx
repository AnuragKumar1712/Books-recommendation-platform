interface BookFiltersProps {
  genres: string[];
  searchInput: string;
  genreInput: string;
  minRatingInput: number;

  onSearchChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onRatingChange: (value: number) => void;
  onApply: () => void;
}

const BookFilters = ({
  genres,
  searchInput,
  genreInput,
  minRatingInput,
  onSearchChange,
  onGenreChange,
  onRatingChange,
  onApply,
}: BookFiltersProps) => {
  return (
    <div
      className="
      bg-[var(--color-card)]
      border border-[var(--color-border)]
      rounded-xl
      p-6
      literary-shadow
      mb-10
      flex flex-col gap-5
      lg:flex-row lg:items-end lg:gap-6
      "
    >
      {/* Search */}
      <div className="flex flex-col w-full lg:w-1/3">
        <label className="text-xs text-[var(--color-muted-foreground)] mb-1">
          Search
        </label>

        <input
          type="text"
          placeholder="Book title or author"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className="
          bg-[var(--color-background)]
          border border-[var(--color-border)]
          rounded-lg
          px-3 py-2
          text-sm
          text-[var(--color-foreground)]
          placeholder:text-[var(--color-muted-foreground)]
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--color-primary)]
          "
        />
      </div>

      {/* Genre */}
      <div className="flex flex-col w-full lg:w-1/4">
        <label className="text-xs text-[var(--color-muted-foreground)] mb-1">
          Genre
        </label>

        <select
          value={genreInput}
          onChange={(e) => onGenreChange(e.target.value)}
          className="
          bg-[var(--color-background)]
          border border-[var(--color-border)]
          rounded-lg
          px-3 py-2
          text-sm
          text-[var(--color-foreground)]
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--color-primary)]
          cursor-pointer
          "
        >
          <option value="All">All Genres</option>

          {genres.map((genre) => (
            <option
              key={genre}
              value={genre}
              className="bg-[var(--color-card)] text-[var(--color-foreground)]"
            >
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Rating */}
      <div className="flex flex-col w-full lg:w-1/4">
        <label className="text-xs text-[var(--color-muted-foreground)] mb-1">
          Rating
        </label>

        <select
          value={minRatingInput}
          onChange={(e) => onRatingChange(Number(e.target.value))}
          className="
          bg-[var(--color-background)]
          border border-[var(--color-border)]
          rounded-lg
          px-3 py-2
          text-sm
          text-[var(--color-foreground)]
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--color-primary)]
          cursor-pointer
          "
        >
          <option value={0}>All</option>
          <option value={1}>1★ & above</option>
          <option value={2}>2★ & above</option>
          <option value={3}>3★ & above</option>
          <option value={4}>4★ & above</option>
        </select>
      </div>

      {/* Apply Button */}
      <button
        onClick={onApply}
        className="
        w-full lg:w-auto
        px-6 py-2
        text-sm
        rounded-lg
        bg-gradient-to-r from-blue-500 to-violet-500
        text-white
        font-medium
        hover:scale-[1.02]
        hover:shadow-lg hover:shadow-blue-500/30
        transition
        cursor-pointer
        "
      >
        Apply Filters
      </button>
    </div>
  );
};

export default BookFilters;
