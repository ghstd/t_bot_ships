export function whoseMove(counter: number): number {
	if (counter % 2 < 2) {
		return counter % 2
	} else {
		return whoseMove(counter % 2)
	}
}