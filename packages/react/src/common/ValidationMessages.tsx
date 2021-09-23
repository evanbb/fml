interface ValidationMessagesProps {
  validationMessages: string[];
}

export default function ValidationMessages({
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
