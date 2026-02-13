import { useState, useEffect, useRef } from "react";
import { Check, Sparkles, MessageCircle } from "lucide-react";
import { C } from "../../config/constants";
import { useFlash } from "../../context/AppContext";
import IdeaCard from "./IdeaCard";
import AddIdeaInput from "./AddIdeaInput";

const WATERMARK_OFFSETS = {
  1: { top: -20, left: 4, size: 210 },
  2: { top: -16, left: -6, size: 215 },
  3: { top: -16, left: -4, size: 215 },
  4: { top: -18, left: -8, size: 220 },
  5: { top: -16, left: -4, size: 215 },
  6: { top: -14, left: -2, size: 210 },
};

export default function CategorySection({ category, ideas, dispatch, isActive, onGoDeeper, delay, isLast }) {
  const { flash } = useFlash();
  const isFlashing = flash === category.id;
  const hasIdeas = ideas.length > 0;
  const wm = WATERMARK_OFFSETS[category.number] || { top: -16, left: -4, size: 220 };
  const [newIds, setNewIds] = useState(new Set());
  const prevCountRef = useRef(ideas.length);

  useEffect(() => {
    if (ideas.length > prevCountRef.current) {
      const newOnes = ideas.slice(prevCountRef.current);
      const ids = new Set(newOnes.map((a) => a.id));
      setNewIds(ids);
      setTimeout(() => setNewIds(new Set()), 600);
    }
    prevCountRef.current = ideas.length;
  }, [ideas]);

  return (
    <>
      <div
        className={`rule-section ${isActive ? "rule-active" : ""} ${isFlashing ? "rule-flashing" : ""}`}
        style={{ animationDelay: `${delay}s`, "--rule-color": category.color || C.accent }}
        id={`category-${category.id}`}
      >
        <span className="rule-watermark" style={{ top: wm.top, left: wm.left, fontSize: wm.size }}>
          {category.number}
        </span>

        <div className="rule-content">
          <div className="rule-header">
            <div className="rule-number-label" style={{ color: category.color || C.accent }}>
              Category {category.number}
              {hasIdeas && (
                <span className="rule-check" style={{ background: `${category.color || C.accent}18`, color: category.color || C.accent }}>
                  <Check size={12} />
                </span>
              )}
            </div>
          </div>
          <h2 className="rule-name">{category.title}</h2>
          <div className="rule-principle" style={{ borderLeftColor: category.color || C.accent }}>
            <p>{category.principle}</p>
          </div>

          {hasIdeas ? (
            <div className="rule-actions">
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} categoryId={category.id} dispatch={dispatch} isNew={newIds.has(idea.id)} />
              ))}
            </div>
          ) : (
            <div className="rule-empty">
              <Sparkles size={22} color={category.color || C.accent} style={{ opacity: 0.5, marginBottom: 10 }} />
              <p className="rule-empty-title">No ideas yet</p>
              <p className="rule-empty-hint">{category.emptyNudge}</p>
            </div>
          )}

          <div className="rule-footer">
            <div className="rule-footer-add">
              <AddIdeaInput categoryId={category.id} dispatch={dispatch} />
            </div>
            <button onClick={() => onGoDeeper(category)} className="btn-go-deeper" style={{ background: category.color || C.accent }}>
              <MessageCircle size={14} /> Brainstorm with AI
            </button>
          </div>
        </div>
      </div>

      {!isLast && (
        <div className="rule-separator">
          <div className="rule-separator-line" />
        </div>
      )}
    </>
  );
}
