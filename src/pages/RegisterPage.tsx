import Registration from '@/components/Registration';
import Fee from '@/components/Fee';
import Participation from '@/components/Participation';

export default function RegisterPage() {
  return (
    <div className="pt-16">
      <Fee />
      <Participation />
      <Registration />
    </div>
  );
}
