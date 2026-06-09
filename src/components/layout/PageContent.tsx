import { useNutritionStore } from '../../stores/useNutritionStore';
import type { IslandCardData } from './IslandCard.tsx';
import { HeroSection } from '../sections/HeroSection.tsx';
import { AnalyzeSection } from '../sections/AnalyzeSection.tsx';
import { IslandScrollSection } from '../sections/IslandScrollSection.tsx';
import { FooterSection } from '../sections/FooterSection.tsx';

export function PageContent() {
  const data = useNutritionStore((s) => s.data);

  const islands: IslandCardData[] = [
    {
      id: 'protein',
      index: '02',
      title: '蛋白質群峰',
      subtitle: 'Protein Peaks',
      description: '肌肉修復與代謝的基石。攝取進度會影響冰晶星球的結構密度與光澤。',
      metricLabel: '達成率',
      metricValue: data.protein.achievementRate,
      metricFormat: 'percent',
      metricIntake: data.protein.intake,
      metricTarget: data.protein.target,
      variant: 'ice',
      metric: data.protein.achievementRate,
    },
    {
      id: 'nebula',
      index: '03',
      title: '能量星雲',
      subtitle: 'Energy Nebula',
      description: '血糖穩定度決定氣態星球的流動紋理。越穩定，星雲越平順、色彩越溫和。',
      metricLabel: '血糖穩定',
      metricValue: data.carbs.bloodSugarStability,
      metricFormat: 'percent',
      metricIntake: data.carbs.intake,
      metricTarget: data.carbs.target,
      variant: 'gas',
      metric: data.carbs.bloodSugarStability,
    },
    {
      id: 'oasis',
      index: '04',
      title: '纖維綠洲',
      subtitle: 'Vitality Oasis',
      description: '腸道活力的象徵。纖維攝取越充足，星球大氣層越明亮、生態紋理越豐富。',
      metricLabel: '達成率',
      metricValue: data.fiber.achievementRate,
      metricFormat: 'percent',
      metricIntake: data.fiber.intake,
      metricTarget: data.fiber.target,
      variant: 'terran',
      metric: data.fiber.achievementRate,
    },
  ];

  return (
    <main className="scroll-page">
      <HeroSection />
      <AnalyzeSection />
      {islands.map((island) => (
        <IslandScrollSection
          key={island.id}
          data={island}
          sectionIndex={island.index}
        />
      ))}
      <FooterSection />
    </main>
  );
}
