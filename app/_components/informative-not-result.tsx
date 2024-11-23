interface InformativeNotResultProps {
  message: string;
  emoji?: string;
}

const InformativeNotResult = ({
  message,
  emoji,
}: InformativeNotResultProps) => {
  return (
    <p className="py-4 text-center text-muted-foreground">
      {message} {emoji}
    </p>
  );
};

export default InformativeNotResult;
