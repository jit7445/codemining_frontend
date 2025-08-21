import clsx from "clsx";

interface ButtonProps {
  type?: "button" | "submit" | "reset" | undefined;
  fullWidth?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
  className?: string; 
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled,
  className,
}) => {
  return ( 
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clsx(
        `
        flex 
        justify-center 
        rounded-md 
        px-3 
        py-2 
        text-sm 
        font-semibold 
        focus-visible:outline 
        focus-visible:outline-2 
        focus-visible:outline-offset-2 
        `,
        disabled && 'opacity-50 cursor-default',
        fullWidth && 'w-full',
        secondary ? 'bg-gray-500 text-white' : 'bg-blue-500 text-white',
        danger && 'bg-red-500 text-white',
        className // Include className prop
      )}
    >
      {children}
    </button>
  );
}

export default Button;