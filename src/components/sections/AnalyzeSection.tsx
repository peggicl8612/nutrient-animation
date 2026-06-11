import { useRef, useState, type CSSProperties } from 'react';
import { isFirebaseConfigured } from '../../firebaseConfig';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useNutritionStore } from '../../stores/useNutritionStore';
import { nutritionProvider } from '../../data/MockNutritionProvider';
import { DEFAULT_MANUAL_INPUT } from '../../data/mockNutritionData';
import type { ManualNutritionInput } from '../../types/ui';
import { pickTarotCard } from '../../data/mockTarotCards';
import { MEAL_COLORS } from '../../types/ui';
import { ImageUploadZone } from '../panel/ImageUploadZone';
import { NutritionTargetForm } from '../panel/NutritionTargetForm';
import { MealTypeSelector } from '../panel/MealTypeSelector';
import { ManualInputForm } from '../panel/ManualInputForm';
import { AnalyzeLoading } from '../panel/AnalyzeLoading';
import { NutritionFactsCard } from '../panel/NutritionFactsCard';
import { useNutrientAI } from '../../hooks/useNutrientAI';
import { mapAiToNutritionData } from '../../utils/mapAiToNutritionData';

export function AnalyzeSection() {
  const ref = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(panelRef, { once: true, margin: '-15%' });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const bgIntensity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.95, 0.85]);

  const isAnalyzing = useUIStore((s) => s.isAnalyzing);
  const setAnalyzing = useUIStore((s) => s.setAnalyzing);
  const setAnalyzeProgress = useUIStore((s) => s.setAnalyzeProgress);
  const resetAnalysis = useUIStore((s) => s.resetAnalysis);
  const selectedMeal = useUIStore((s) => s.selectedMeal);
  const setDrawnTarotCard = useUIStore((s) => s.setDrawnTarotCard);
  const setData = useNutritionStore((s) => s.setData);
  const mealToken = MEAL_COLORS[selectedMeal];

  const { errorMessage, uploadAndAnalyze, setErrorMessage } = useNutrientAI();

  const [mode, setMode] = useState<'image' | 'manual'>(
    isFirebaseConfigured ? 'image' : 'manual'
  );
  const [manualInput, setManualInput] = useState<ManualNutritionInput>(DEFAULT_MANUAL_INPUT);
  const [hasImage, setHasImage] = useState(false);
  const selectedFileRef = useRef<File | null>(null);

  const handleAnalyze = async () => {
    if (isAnalyzing) return;
    setErrorMessage('');
    setAnalyzing(true);
    setAnalyzeProgress(0);

    try {
      if (mode === 'image') {
        const file = selectedFileRef.current;
        if (!file) {
          setErrorMessage('請先上傳食物照片');
          return;
        }

        const aiResult = await uploadAndAnalyze(file, setAnalyzeProgress);
        const result = mapAiToNutritionData(aiResult, manualInput);
        setData(result);
        setDrawnTarotCard(pickTarotCard(result));
      } else {
        const result = await nutritionProvider.simulateAnalysis(
          { manual: manualInput, mealType: selectedMeal },
          setAnalyzeProgress,
        );
        setData(result);
        setDrawnTarotCard(pickTarotCard(result));
      }
    } catch {
      // errorMessage 已由 useNutrientAI 設定
    } finally {
      resetAnalysis();
    }
  };

  return (
    <section ref={ref} className="section section-analyze" aria-label="營養分析">
      <motion.div className="section-analyze-bg" style={{ opacity: bgIntensity }} />

      <div className="section-analyze-inner">
        <motion.header
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-index">01</span>
          <h2 className="section-title">影像辨識 · 營養分析</h2>
          <p className="section-desc">
            上傳食物照片進行 AI 影像辨識並設定每日目標，或手動輸入每項營養素的攝取與目標。
            系統將計算熱量、巨量營養素佔比與血糖穩定指數，並連動三座星球生態。
          </p>
        </motion.header>

        <motion.div
          ref={panelRef}
          className="analyze-grid"
          initial={{ opacity: 0, y: 56 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="analyze-panel"
            style={
              {
                '--meal-color': mealToken.primary,
                '--meal-glow': mealToken.glow,
              } as CSSProperties
            }
          >
            <div className="analyze-panel-meal">
              <span className="analyze-panel-meal-label">餐別</span>
              <MealTypeSelector disabled={isAnalyzing} />
            </div>

            <div className="analyze-panel-tabs">
              <button
                type="button"
                className={mode === 'image' ? 'panel-tab panel-tab-active' : 'panel-tab'}
                disabled={isAnalyzing || !isFirebaseConfigured}
                title={isFirebaseConfigured ? undefined : '線上版尚未設定 Firebase'}
                onClick={() => setMode('image')}
              >
                圖片上傳
              </button>
              <button
                type="button"
                className={mode === 'manual' ? 'panel-tab panel-tab-active' : 'panel-tab'}
                disabled={isAnalyzing}
                onClick={() => setMode('manual')}
              >
                手動輸入
              </button>
            </div>

            <div className="analyze-panel-body">
              {mode === 'image' ? (
                <>
                  <ImageUploadZone
                    disabled={isAnalyzing}
                    onFileSelect={(file) => {
                      selectedFileRef.current = file;
                      setHasImage(file !== null);
                    }}
                  />
                  <NutritionTargetForm
                    values={manualInput}
                    disabled={isAnalyzing}
                    onChange={setManualInput}
                  />
                </>
              ) : (
                <ManualInputForm
                  values={manualInput}
                  disabled={isAnalyzing}
                  onChange={setManualInput}
                />
              )}

              <AnalyzeLoading />

              {!isFirebaseConfigured && (
                <p className="analyze-hint">
                  線上展示版未設定 Firebase，請使用「手動輸入」；若要啟用 AI 影像分析，請在 GitHub
                  Repository Secrets 設定 VITE_FIREBASE_* 環境變數後重新部署。
                </p>
              )}

              {errorMessage && (
                <p className="analyze-error" role="alert">{errorMessage}</p>
              )}

              <button
                type="button"
                className="control-panel-submit control-panel-submit-meal"
                disabled={isAnalyzing || (mode === 'image' && !hasImage)}
                onClick={handleAnalyze}
              >
                <Sparkles size={16} />
                {isAnalyzing ? '分析中…' : '開始分析'}
              </button>
            </div>
          </div>

          <NutritionFactsCard />
        </motion.div>
      </div>
    </section>
  );
}
