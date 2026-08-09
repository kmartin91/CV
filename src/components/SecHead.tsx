interface SecHeadProps {
  label: string;
  num: string;
}

export default function SecHead({ label, num }: SecHeadProps) {
  return (
    <div className="sechead">
      <p className="label">{label}</p>
      <span className="num">{num}</span>
    </div>
  );
}
