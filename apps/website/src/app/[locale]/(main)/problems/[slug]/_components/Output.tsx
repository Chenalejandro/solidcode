export default function Output(props: { output: string }) {
  const { output } = props;
  return <code>{output}</code>;
}
