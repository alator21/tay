
export function pluralize(times: number, singular: string, plural: string): string {
	return times === 1 ? singular : plural;
}
