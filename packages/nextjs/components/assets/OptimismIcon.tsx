import Image from "next/image";

export const OptimismIcon = ({ className = "h-full w-full object-contain" }: { className?: string }) => {
  return (
    <div className="h-19 w-19">
      <Image
        src="https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=029"
        alt="optimism icon"
        className={className}
        height={19}
        width={19}
      />
    </div>
  );
};
