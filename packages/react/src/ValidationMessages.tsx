interface ValidationMessagesProps {
  validationMessages: string[];
}

export function ValidationMessages({
  validationMessages,
}: ValidationMessagesProps) {
  return (
    <>
      {validationMessages.map((msg) => (
        <p key={msg}>{msg}</p>
      ))}
    </>
  );
}
