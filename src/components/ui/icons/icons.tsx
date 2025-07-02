import React from "react";

import { SaveAll, Undo2, Plus, Pencil, Trash2, Check, X } from "lucide-react";

const iconMap = {
  save: SaveAll,
  undo: Undo2,
  plus: Plus,
  edit: Pencil,
  delete: Trash2,
  accept: Check,
  cancell: X,
  loading: () => (
    <svg className='animate-spin' viewBox='0 0 24 24'>
      <circle cx='12' cy='12' r='10' strokeWidth='4' fill='none' />
    </svg>
  ),
};

interface IconProps {
  action: keyof typeof iconMap;
  color?: string;
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  action,
  color = "currentColor",
  size = 24,
  className,
}) => {
  const IconComponent = iconMap[action];
  return <IconComponent color={color} size={size} className={className} />;
};

export default Icon;
