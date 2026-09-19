import React, { useState } from 'react';
import { BadgeItem } from '../../types';
import {
  Footprints,
  Sparkles,
  Compass,
  Flame,
  Zap,
  Trophy,
  Clock,
  TrendingUp,
  Target,
  Crown,
  Award,
  Lock,
  CheckCircle2,
  Filter
} from 'lucide-react';

interface GamifiedBadgesProps {
  badges: BadgeItem[];
  title?: string;
  showFilters?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Footprints,
  Sparkles,
  Compass,
  Flame,
  Zap,
  Trophy,
  Clock,
  TrendingUp,
  Target,
  Crown,
  Award
};

export const GamifiedBadges: React.FC<GamifiedBadgesProps> = ({
  badges,
  title = 'Achievements & Mastery Badges',
  showFilters = true
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | BadgeItem['category']>('all');

  const filteredBadges = selectedCategory === 'all'
    ? badges
    : badges.filter(b => b.category === selectedCategory);

  const unlockedCount = badges.filter(b => b.unlocked).length;

  const getRarityBadge = (rarity: BadgeItem['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'epic':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'rare':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-400">
                {unlockedCount} of {badges.length} badges unlocked
              </p>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full sm:w-48">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Overall Progress</span>
            <span className="font-semibold text-amber-400">
              {Math.round((unlockedCount / Math.max(1, badges.length)) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / Math.max(1, badges.length)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      {showFilters && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            All Badges ({badges.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('milestone')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'milestone'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            Milestones
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('mastery')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'mastery'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            Mastery
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('recovery')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'recovery'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            Concept Recovery
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('consistency')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'consistency'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            Streaks & Consistency
          </button>
        </div>
      )}

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredBadges.map((badge) => {
          const IconComponent = ICON_MAP[badge.icon] || Award;
          const isUnlocked = badge.unlocked;

          return (
            <div
              key={badge.id}
              className={`p-3.5 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-slate-800/60 border-indigo-500/30 hover:border-indigo-500/60 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-75'
              }`}
            >
              {/* Top Row: Icon & Status */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    isUnlocked
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getRarityBadge(
                      badge.rarity
                    )}`}
                  >
                    {badge.rarity}
                  </span>
                  {isUnlocked ? (
                    <div
                      className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400"
                      title="Unlocked"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div
                      className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500"
                      title="Locked"
                    >
                      <Lock className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h4
                  className={`text-sm font-bold leading-tight ${
                    isUnlocked ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {badge.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {badge.description}
                </p>
              </div>

              {/* Bottom Progress or Unlock Stamp */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                {isUnlocked ? (
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <span>Unlocked</span>
                    {badge.unlockedAt && (
                      <span className="text-slate-500 font-normal">({badge.unlockedAt})</span>
                    )}
                  </span>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span>Progress</span>
                      <span className="font-semibold text-slate-400">{badge.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
