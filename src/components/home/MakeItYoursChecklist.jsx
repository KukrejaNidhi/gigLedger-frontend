import React, { useState } from 'react';
import { ChevronRight, ChevronDown, CheckCircle2, Circle } from 'lucide-react';

/**
 * "Make it yours" Setup Checklist Card
 * Features:
 * - Dynamic interactive checklist with circular status
 * - Chevron navigation items
 * - Collapsible "Completed (x)" section
 * - Tactile card shadows (shadow-sm hover:shadow-md)
 * - 100% zero emojis
 */
export const MakeItYoursChecklist = ({
  onItemClick,
  className = '',
}) => {
  const [items, setItems] = useState([
    { id: 'cat', label: 'Make categories yours', completed: false },
    { id: 'acc', label: 'Add your accounts', completed: false },
    { id: 'alert', label: 'Enable personalised alerts', completed: false },
  ]);

  const [completedItems, setCompletedItems] = useState([
    { id: 'auth', label: 'Verified 2FA Security', completed: true },
    { id: 'profile', label: 'Initialized Earner Profile', completed: true },
  ]);

  const [isCompletedOpen, setIsCompletedOpen] = useState(false);

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleRowClick = (item) => {
    if (onItemClick) onItemClick(item);
    else toggleItem(item.id);
  };

  const totalCompleted =
    completedItems.length + items.filter((i) => i.completed).length;

  return (
    <div className={`w-full rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D] p-5 shadow-sm hover:shadow-md transition-all space-y-4 select-none ${className}`}>
      
      {/* SECTION HEADING */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
          Make it yours
        </h2>
        <span className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-200/60 dark:border-sky-800/50">
          Setup Checklist
        </span>
      </div>

      {/* CHECKLIST ITEMS */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleRowClick(item)}
            className="flex items-center justify-between py-2 px-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition group"
          >
            <div className="flex items-center gap-3">
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-400 group-hover:text-sky-500 flex-shrink-0 transition" />
              )}
              <span className={`text-xs sm:text-sm font-medium ${
                item.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400'
              }`}>
                {item.label}
              </span>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition flex-shrink-0" />
          </div>
        ))}
      </div>

      {/* COMPLETED ACCORDION */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => setIsCompletedOpen(!isCompletedOpen)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          {isCompletedOpen ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
          <span>Completed ({totalCompleted})</span>
        </button>

        {isCompletedOpen && (
          <div className="mt-2 space-y-2 pl-4 animate-fadeIn">
            {completedItems.map((comp) => (
              <div key={comp.id} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="line-through">{comp.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
