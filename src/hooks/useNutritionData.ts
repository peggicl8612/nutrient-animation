/**
 * 營養資料改由 ControlPanel 觸發更新。
 * 此 hook 保留供未來 Provider 訂閱擴充，現階段不需自動輪詢。
 */
export function useNutritionData() {
  // no-op：初始資料由 useNutritionStore 的 initialMockData 提供
}
