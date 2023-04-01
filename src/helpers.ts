export function checkField(data: any[][]) {

	const success = {
		status: true,
		message: 'успешная расстановка',
	};

	const error = {
		status: false,
		message: 'неправильная расстановка',
	};

	let one = 0;
	let two = 0;
	let three = 0;
	let four = 0;

	for (let i = 0; i < data.length; i++) {
		for (let n = 0; n < data[i].length; n++) {
			if (data[i][n] === 1 && i < data.length - 1) {
				if (data[i][n + 1] === 1) {
					let k = 1;
					if (data[i + 1][n] === 1) {
						return error
					}
					while (data[i][n + k] === 1) {
						if (data[i + 1][n + k] === 1 || data[i + 1][n + k + 1] === 1) {
							return error
						}
						if (k > 3) {
							return error
						}
						k++
					}
					if ((data[i][n + k] === 1) && (data[i + 1][n + k] === 1)) {
						return error
					}
					switch (k) {
						case 2:
							two = two + 1
							break;
						case 3:
							three = three + 1
							break;
						case 4:
							four = four + 1
							break;

						default:
							break;
					}
					n = n + k
				} else if (data[i + 1][n] === 1) {
					let k = 1;
					if (data[i][n + 1] === 1) {
						return error
					}
					while (data[i + k][n] === 1 && i + 1 < data.length && n + 1 < data.length) {
						if (data[i + k][n + 1] === 1) {
							return error
						}
						if (k > 3) {
							return error
						}
						k++
					}
					if ((data[i + k][n] === 1 && i + 1 < data.length) && (data[i + k][n + 1] === 1 && i + 1 < data.length)) {
						return error
					}
					switch (k) {
						case 2:
							two = two + 1
							break;
						case 3:
							three = three + 1
							break;
						case 4:
							four = four + 1
							break;

						default:
							break;
					}
					n = n + 1
				} else {
					if ((data[i][n + 1] === 1) &&
						(data[i + 1][n] === 1 && i + 1 < data.length) &&
						data[i + 1][n + 1] === 1 && i + 1 < data.length) {
						return error
					}
					one = one + 1
					n = n + 1
				}
			}
		}
	}

	if (one + two + three + four === 20) {
		if (one !== 4) {
			error.message = 'неверное количество 1-пал'
			return error
		} else if (two !== 3) {
			error.message = 'неверное количество 2-пал'
			return error
		} else if (three !== 2) {
			error.message = 'неверное количество 3-пал'
			return error
		} else if (four !== 1) {
			error.message = 'неверное количество 4-пал'
			return error
		} else {
			return success
		}
	} else {
		error.message = 'продолжайте расстановку:'
		return error
	}
}

export function whoseMove(counter: number) {
	if (counter % 2 < 2) {
		return counter % 2
	} else {
		whoseMove(counter % 2)
	}
}
