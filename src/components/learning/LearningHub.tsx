import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
  Award,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { COURSE_MODULES } from '../../data/mockData';
import { CourseModule } from '../../types';

export const LearningHub: React.FC = () => {
  const { playSound, awardXp } = useApp();
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [activeCourse, setActiveCourse] = useState<CourseModule | null>(null);
  const [activeQuizQuestionIndex, setActiveQuizQuestionIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const filteredCourses = COURSE_MODULES.filter(
    (c) => selectedTrack === 'all' || c.track.toLowerCase() === selectedTrack.toLowerCase()
  );

  const handleStartCourse = (course: CourseModule) => {
    playSound('click');
    setActiveCourse(course);
    setActiveQuizQuestionIndex(0);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
  };

  const handleAnswerQuiz = (optionIdx: number) => {
    if (quizSubmitted) return;
    playSound('click');
    setSelectedQuizOption(optionIdx);
  };

  const handleCheckQuiz = () => {
    if (selectedQuizOption === null || !activeCourse) return;
    setQuizSubmitted(true);
    const currQuestion = activeCourse.quizQuestions[activeQuizQuestionIndex];
    if (selectedQuizOption === currQuestion.correctIndex) {
      playSound('success');
      awardXp(50);
    } else {
      playSound('alert');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Course Reader Modal if active */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {activeCourse.track} Track · {activeCourse.category}
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {activeCourse.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveCourse(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
              {/* Sections */}
              {activeCourse.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    {sec.heading}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {sec.content}
                  </p>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-semibold">
                    🔑 {sec.goldenRule}
                  </div>
                </div>
              ))}

              {/* End of Lesson Knowledge Check */}
              {activeCourse.quizQuestions.length > 0 && (
                <div className="mt-8 p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    <span>Knowledge Check</span>
                  </div>

                  <p className="font-bold text-xs sm:text-sm text-slate-900">
                    {activeCourse.quizQuestions[activeQuizQuestionIndex].question}
                  </p>

                  <div className="space-y-2">
                    {activeCourse.quizQuestions[activeQuizQuestionIndex].options.map(
                      (opt, oIdx) => {
                        const isSelected = selectedQuizOption === oIdx;
                        const isCorrect =
                          quizSubmitted &&
                          oIdx === activeCourse.quizQuestions[activeQuizQuestionIndex].correctIndex;
                        const isWrong = quizSubmitted && isSelected && !isCorrect;

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleAnswerQuiz(oIdx)}
                            className={`w-full p-3 rounded-xl text-left text-xs font-semibold transition-all border flex items-center justify-between ${
                              isCorrect
                                ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                                : isWrong
                                ? 'bg-red-100 border-red-400 text-red-950'
                                : isSelected
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <span>{opt}</span>
                            {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      disabled={selectedQuizOption === null}
                      onClick={handleCheckQuiz}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700">
                      {activeCourse.quizQuestions[activeQuizQuestionIndex].explanation}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => {
                  playSound('success');
                  awardXp(activeCourse.xpReward);
                  setActiveCourse(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
              >
                Complete Lesson & Earn +{activeCourse.xpReward} XP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Learning Hub Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>Structured Academic Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Digital Safety & Scam Prevention Academy
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
            Step-by-step masterclasses spanning foundational payment protocols to advanced adversarial psychological defense.
          </p>
        </div>

        {/* Track Filters */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl self-start md:self-auto">
          {['all', 'beginner', 'intermediate', 'advanced'].map((trk) => (
            <button
              key={trk}
              onClick={() => setSelectedTrack(trk)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl capitalize transition-all ${
                selectedTrack === trk
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {trk}
            </button>
          ))}
        </div>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredCourses.map((c) => (
          <div
            key={c.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-600 uppercase tracking-wider text-[10px]">
                  {c.track} Track
                </span>
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {c.durationMinutes} mins
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                {c.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {c.description}
              </p>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Certification XP:</span>
                <span className="font-extrabold text-indigo-600">+{c.xpReward} XP</span>
              </div>
            </div>

            <button
              onClick={() => handleStartCourse(c)}
              className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Start Course</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
