export interface GoalField {
  id: string;
  label: string;
  placeholder: string;
  unit: string;
  hint: string;
}

export interface GoalCategory {
  key: string;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  fields: GoalField[];
}
