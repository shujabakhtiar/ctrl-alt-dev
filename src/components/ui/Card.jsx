export default function Card({
  children,
  className = '',
  interactive = false,
  as: Component = 'div',
  ...rest
}) {
  const interactiveClasses = interactive
    ? 'cursor-pointer hover:border-[#46536B] hover:bg-[#171D29] hover:-translate-y-0.5 transition-all duration-150'
    : '';

  return (
    <Component
      className={`bg-[#111620] border border-[#2A3242] rounded-[8px] p-5 relative ${interactiveClasses} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}
