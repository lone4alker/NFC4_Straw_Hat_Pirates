import React from "react";

const templateCategories = [
  {
    title: "Minimal",
    fontClass: "font-sans text-gray-800",
  },
  {
    title: "Modern",
    fontClass: "font-medium italic text-blue-700 tracking-wider",
  },
  {
    title: "Legal",
    fontClass: "font-serif text-lg text-gray-900",
  },
  {
    title: "Elegant",
    fontClass: "font-light italic text-purple-800",
  },
  {
    title: "Funky",
    fontClass: "font-bold uppercase text-pink-600",
  },
  {
    title: "Corporate",
    fontClass: "font-semibold text-blue-900 tracking-tight",
  },
];

export default function ClauseTemplates() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Clause Templates</h1>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Browse by style</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {templateCategories.map((category, index) => (
            <div
              key={index}
              className="rounded-xl shadow hover:shadow-lg transition border flex items-center justify-center h-32 bg-gray-100"
            >
              <div className={`text-center text-2xl ${category.fontClass}`}>
                {category.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
