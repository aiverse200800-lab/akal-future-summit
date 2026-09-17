import Fee from '@/components/Fee';
import Participation from '@/components/Participation';
import Registration from '@/components/Registration';
import ReachUs from '@/components/ReachUs';

export default function RegisterPage() {
  return (
    <div className="pt-16">
      <Fee />
      <Participation />
      <Registration />
      <ReachUs />
    </div>
  );
}
