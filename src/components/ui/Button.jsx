import { Link } from 'react-router-dom';

export default function Button({
  children,
  variant = 'lime',
  size = 'md',
  className = '',
  to,
  href,
  onClick,
  disabled = false,
  loading = false,
  icon,
  iconRight,
  type = 'button',
  ...rest
}) {
  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3 rounded-[5px]',
    md: 'text-sm py-2 px-4 rounded-[6px]',
    lg: 'text-base py-3 px-6 rounded-[8px] tracking-wide',
  }[size] || 'text-sm py-2 px-4 rounded-[6px]';

  const variantClassMap = {
    primary: 'btn-tactile-lime',
    lime: 'btn-tactile-lime',
    secondary: 'btn-tactile-dark',
    dark: 'btn-tactile-dark',
    pink: 'btn-tactile-pink',
    blue: 'btn-tactile-blue',
    purple: 'btn-tactile-purple',
    yellow: 'btn-tactile-yellow',
    cyan: 'btn-tactile-cyan',
    orange: 'btn-tactile-orange',
    ghost: 'bg-transparent text-[#AAB7D0] hover:text-[#F4F2EC] hover:bg-[#171D29] border border-transparent',
  };

  const variantClass = variantClassMap[variant] || 'btn-tactile-lime';
  const baseClasses = `btn-tactile ${sizeClasses} ${variantClass} ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`;

  const content = (
    <>
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : icon ? (
        <span className="inline-flex shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
      {iconRight && <span className="inline-flex shrink-0 ml-1">{iconRight}</span>}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={baseClasses} {...rest}>
        {content}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} className={baseClasses} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {content}
    </button>
  );
}
