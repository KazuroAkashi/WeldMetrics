interface ListButton {
  title?: string;
  icon?: string;
  sub?: ListButton[];
  href?: string;
  click: () => void;
  divider?: boolean;
  dividerline?: boolean;
  dividerlinetop?: boolean;
  subopen?: boolean;
}
