import Day1 from '@/components/Day1';
import Day2 from '@/components/Day2';
import Outcomes from '@/components/Outcomes';
import SchoolImpact from '@/components/SchoolImpact';
import FinalJuryShowcase from '@/components/FinalJuryShowcase';

export default function ProgramPage() {
  return (
    <div className="pt-16">
      <Day1 />
      <Day2 />
      <Outcomes />
      <SchoolImpact />
      <FinalJuryShowcase />
    </div>
  );
}
