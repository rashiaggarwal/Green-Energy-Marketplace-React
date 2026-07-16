export function getAssistantAnswer(question, state) {
  const lower = question.toLowerCase()

  if (lower.includes('renewable')) {
    const renewable = state.credits.filter((credit) => credit.category === 'Renewable')
    return `There are ${renewable.length} renewable credit lots in the registry. Renewable sources include Solar, Wind and Hydro.`
  }

  if (lower.includes('market') || lower.includes('listed')) {
    const listed = state.credits.filter((credit) => credit.status === 'Listed')
    return `There are ${listed.length} credit lots currently listed in the marketplace.`
  }

  if (lower.includes('gas')) {
    return 'Gas-based credits should not be marked as green. They can be used for traceability and electricity accounting, but not as renewable electricity credits.'
  }

  if (lower.includes('audit')) {
    return `Latest audit event: ${state.audit[state.audit.length - 1]}`
  }

  if (lower.includes('revoke')) {
    return 'A listed credit can be revoked by the owner. Once revoked, it is removed from the marketplace but remains owned by the user.'
  }

  return 'Based on available MVP registry data, credits can be created, marked for sell, bought from marketplace, revoked from marketplace, and audited using credit ID.'
}
