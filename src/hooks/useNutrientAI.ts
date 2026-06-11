import { useCallback, useState } from 'react';
import { collection, addDoc, doc, onSnapshot } from 'firebase/firestore';
import { ref as storageRef, uploadBytes } from 'firebase/storage';
import { db, isFirebaseConfigured, storage, storageBucket } from '../firebaseConfig';

const ANALYSIS_TIMEOUT_MS = 60_000;

export interface AiFoodResult {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

interface ExtensionStatus {
  state?: string;
  error?: string;
}

function parseAiResult(raw: string): AiFoodResult {
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  return JSON.parse(cleaned) as AiFoodResult;
}

function toGsUrl(storagePath: string): string {
  return `gs://${storageBucket}/${storagePath}`;
}

function getExtensionError(data: Record<string, unknown>): string | null {
  const status = data.status;
  if (status && typeof status === 'object') {
    const ext = status as ExtensionStatus;
    if (ext.state === 'ERRORED') {
      return ext.error ?? 'AI 分析失敗';
    }
  }
  if (typeof data.error === 'string') return data.error;
  if (data.status === 'failed') return '分析失敗';
  return null;
}

function extractAiResult(data: Record<string, unknown>): AiFoodResult | null {
  const raw = data.aiResult ?? data.response ?? data.output;
  if (!raw) return null;

  if (typeof raw === 'string') return parseAiResult(raw);
  if (typeof raw === 'object') return raw as AiFoodResult;
  return null;
}

export function useNutrientAI() {
  const [errorMessage, setErrorMessage] = useState('');

  const uploadAndAnalyze = useCallback(
    (file: File, onProgress?: (progress: number) => void): Promise<AiFoodResult> => {
      setErrorMessage('');
      onProgress?.(5);

      return new Promise((resolve, reject) => {
        let unsubscribe: (() => void) | null = null;
        let settled = false;

        const finish = (fn: () => void) => {
          if (settled) return;
          settled = true;
          unsubscribe?.();
          clearTimeout(timer);
          fn();
        };

        const timer = setTimeout(() => {
          setErrorMessage('分析逾時，請稍後再試');
          finish(() => reject(new Error('Analysis timeout')));
        }, ANALYSIS_TIMEOUT_MS);

        void (async () => {
          try {
            if (!isFirebaseConfigured || !db || !storage || !storageBucket) {
              const msg = 'AI 影像分析尚未設定，請改用手動輸入模式';
              setErrorMessage(msg);
              finish(() => reject(new Error(msg)));
              return;
            }

            const fileExtension = file.name.split('.').pop() ?? 'jpg';
            const storagePath = `foods/${Date.now()}.${fileExtension}`;
            const imageRef = storageRef(storage, storagePath);

            await uploadBytes(imageRef, file);
            onProgress?.(30);

            // Extension 需要 gs:// 格式，不能用 HTTPS download URL
            const gsUrl = toGsUrl(storagePath);
            onProgress?.(45);

            const docRef = await addDoc(collection(db, 'nutrient-logs'), {
              imagePath: gsUrl,
              storagePath,
              createdAt: new Date(),
              // 勿寫入 status 欄位，Extension 會用它記錄 COMPLETED / ERRORED
            });
            onProgress?.(55);

            unsubscribe = onSnapshot(
              doc(db, 'nutrient-logs', docRef.id),
              (snapshot) => {
                const data = snapshot.data();
                if (!data) return;

                const extError = getExtensionError(data);
                if (extError) {
                  setErrorMessage(extError);
                  finish(() => reject(new Error(extError)));
                  return;
                }

                const extStatus = data.status;
                const isCompleted =
                  extStatus &&
                  typeof extStatus === 'object' &&
                  (extStatus as ExtensionStatus).state === 'COMPLETED';

                const parsed = extractAiResult(data);
                if (parsed) {
                  onProgress?.(100);
                  finish(() => resolve(parsed));
                  return;
                }

                if (isCompleted) {
                  setErrorMessage('AI 回傳格式無法解析，請檢查 Extension 輸出欄位');
                  finish(() => reject(new Error('Empty AI result')));
                  return;
                }

                onProgress?.(70);
              },
              (error) => {
                setErrorMessage('無法取得分析結果，請稍後再試');
                finish(() => reject(error));
              },
            );
          } catch (error) {
            setErrorMessage('系統發生錯誤，請稍後再試');
            finish(() => reject(error));
          }
        })();
      });
    },
    [],
  );

  return { errorMessage, uploadAndAnalyze, setErrorMessage };
}
