import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { Story } from '../types';

interface CustomStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStory: (newStory: Story) => void;
}

export const CustomStoryModal: React.FC<CustomStoryModalProps> = ({
  isOpen,
  onClose,
  onAddStory,
}) => {
  const [title, setTitle] = useState('');
  const [titleHe, setTitleHe] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const finalTitle = title.trim() || 'Mi Texto Personal';
    const finalTitleHe = titleHe.trim() || 'טקסט אישי';

    // Break into paragraphs
    const rawParas = content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    const paragraphs = rawParas.map((p) => ({
      spanish: p,
      hebrew: 'טקסט מותאם אישית (הקש על כל מילה לצפייה בתרגום שלה).',
    }));

    const newStory: Story = {
      id: `custom-${Date.now()}`,
      title: finalTitle,
      titleHe: finalTitleHe,
      author: 'הטקסט שלי',
      level: 'A1 - מתחילים',
      coverImage: '/src/assets/images/cover_maria_farm_1792007358059.jpg',
      descriptionHe: 'טקסט אישי שהזנת לקריאה, תרגום והשמעה.',
      content: content.trim(),
      paragraphs: paragraphs.length > 0 ? paragraphs : [{ spanish: content.trim(), hebrew: '' }],
      quiz: [
        {
          question: `מהו הרעיון המרכזי של הטקסט "${finalTitle}"?`,
          options: ['תרגול ספרדית', 'מתכון', 'מזג אוויר', 'ספורט'],
          answer: 0,
          explanation: 'טקסט מותאם אישית שהוזן על ידך לקריאה ולמידה.',
        },
      ],
    };

    onAddStory(newStory);
    onClose();
    setTitle('');
    setTitleHe('');
    setContent('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">הוסף טקסט בספרדית לקריאה</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              כותרת בספרדית (אופציונלי)
            </label>
            <input
              type="text"
              dir="ltr"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Un café en Madrid"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-latin"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              שם הטקסט בעברית
            </label>
            <input
              type="text"
              value={titleHe}
              onChange={(e) => setTitleHe(e.target.value)}
              placeholder="לדוגמה: כוס קפה במדריד"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              הטקסט בספרדית *
            </label>
            <textarea
              required
              rows={5}
              dir="ltr"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Pega aquí cualquier texto o artículo en español..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-latin"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              כל מילה בטקסט תהיה לחיצה להשמעה, תרגום עברי ושמירה לאוצר המילים שלך!
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>הוסף והתחל לקרוא</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
