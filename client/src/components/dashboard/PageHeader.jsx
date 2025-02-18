import React from "react";
import { FaList, FaTh } from "react-icons/fa";

const PageHeader = ({ 
  title, 
  searchQuery, 
  setSearchQuery, 
  filterOptions, 
  selectedFilter, 
  setSelectedFilter, 
  onAddClick, 
  viewMode, 
  setViewMode 
}) => {
  return (
    <header className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-zinc-600">{title}</h1>

      <div className="controls flex gap-5 px-5">
        {onAddClick && (
          <button 
            className="bg-purple-500 text-white rounded-lg px-3 py-1 text-sm"
            onClick={onAddClick}
          >
            Add {title}
          </button>
        )}

        {searchQuery !== undefined && setSearchQuery && (
          <input
            type="text"
            placeholder={`Search ${title}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-200 text-zinc-600 rounded-lg px-3 py-1 text-sm"
          />
        )}

        {filterOptions && selectedFilter !== undefined && setSelectedFilter && (
          <select
            className="bg-zinc-200 text-zinc-600 rounded-lg px-3 py-1 text-sm"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            {filterOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {/* View Mode Toggle */}
        {setViewMode && (
          <div className="flex justify-center items-center rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 flex items-center gap-1 w-full h-full rounded-lg ${
                viewMode === "grid" ? "bg-purple-500 text-white" : "bg-zinc-200 text-zinc-600"
              }`}
            >
              <FaTh />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 flex items-center gap-1 w-full h-full rounded-lg ${
                viewMode === "list" ? "bg-purple-500 text-white" : "bg-zinc-200 text-zinc-600"
              }`}
            >
              <FaList />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
