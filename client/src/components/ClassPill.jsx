import React from "react";

const departmentColors = {
  "Math": "bg-blue-100 text-blue-800",
  "Com Sci": "bg-yellow-100 text-yellow-800",
  "Physics": "bg-purple-100 text-purple-800",
  "Chem": "bg-red-100 text-red-800",
  "Stats": "bg-green-100 text-green-800",
};

function getDepartment(className) {
  if (className.startsWith("Com Sci")) return "Com Sci";
  if (className.startsWith("Math")) return "Math";
  if (className.startsWith("Physics")) return "Physics";
  if (className.startsWith("Chem")) return "Chem";
  if (className.startsWith("Stats")) return "Stats";
  return "default";
}

export default function ClassPill({
  value,
  onRemove,        // optional
  removable = false
}) {
  const department = getDepartment(value);
  const colorClasses =
    departmentColors[department] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${colorClasses}`}
    >
      {value}

      {removable && (
        <button
          type="button"
          onClick={() => onRemove?.(value)}
          className="cursor-pointer font-bold opacity-70 hover:opacity-100"
          aria-label={`Remove ${value}`}
        >
          ✕
        </button>
      )}
    </span>
  );
}