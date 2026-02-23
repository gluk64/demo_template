type SmokeSectionProps = {
  title: string
  children: React.ReactNode
  'data-testid'?: string
}

export const SmokeSection = ({
  title,
  children,
  'data-testid': testId,
}: SmokeSectionProps): React.JSX.Element => {
  return (
    <section className="mt-8" data-testid={testId}>
      <h2 className="text-h3 font-medium text-text-primary mb-4">{title}</h2>
      {children}
    </section>
  )
}
