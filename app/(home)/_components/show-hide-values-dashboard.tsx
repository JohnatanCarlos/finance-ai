"use client";

import { Eye, EyeClosed } from "lucide-react";

interface ShowHideValuesDashboardProps {
  hideValue: boolean;
  onToggleHide: (value: boolean) => void;
}

const ShowHideValuesDashboard = ({
  hideValue,
  onToggleHide,
}: ShowHideValuesDashboardProps) => {
  return (
    <>
      {!hideValue && (
        <Eye className="cursor-pointer" onClick={() => onToggleHide(true)} />
      )}
      {hideValue && (
        <EyeClosed
          className="cursor-pointer"
          onClick={() => onToggleHide(false)}
        />
      )}
    </>
  );
};

export default ShowHideValuesDashboard;
