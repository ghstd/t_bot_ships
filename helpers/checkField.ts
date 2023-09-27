export function checkField(inputData: number[][]) {

	const data: number[][] = inputData.map((arr) => new Array().concat(arr));

	const quantityOfItems: { [key: string]: number } = {
		1: 0,
		2: 0,
		3: 0,
		4: 0
	};

	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data[i].length; j++) {

			if (data[i][j] === 1) {
				let quantityCounter = 0;
				data[i][j] = 2
				quantityCounter++

				if (data[i][j + 1] ? data[i][j + 1] === 1 : false) {

					data[i][j + 1] = 2
					quantityCounter++
					if (data[i + 1]) {
						data[i + 1][j] = 0
						data[i + 1][j + 1] = 0
					}
					if (data[i][j + 2] ? data[i][j + 2] === 1 : false) {
						data[i][j + 2] = 2
						quantityCounter++
						if (data[i + 1]) {
							data[i + 1][j + 2] = 0
						}
						if (data[i][j + 3] ? data[i][j + 3] === 1 : false) {
							data[i][j + 3] = 2
							quantityCounter++
							data[i][j + 4] = 0
							if (data[i + 1]) {
								data[i + 1][j + 3] = 0
								data[i + 1][j + 4] = 0
							}
						} else {
							data[i][j + 3] ? data[i][j + 3] = 0 : false
							if (data[i + 1]) {
								data[i + 1][j + 3] = 0
							}
						}
					} else {
						data[i][j + 2] ? data[i][j + 2] = 0 : false
						if (data[i + 1]) {
							data[i + 1][j + 2] = 0
						}
					}

				} else if (data[i + 1] ? data[i + 1][j] === 1 : false) {

					data[i + 1][j] = 2
					quantityCounter++
					data[i][j + 1] ? data[i][j + 1] = 0 : false
					data[i + 1][j + 1] ? data[i + 1][j + 1] = 0 : false
					if (data[i + 2] ? data[i + 2][j] === 1 : false) {
						data[i + 2][j] = 2
						quantityCounter++
						data[i + 2][j + 1] ? data[i + 2][j + 1] = 0 : false
						if (data[i + 3] ? data[i + 3][j] === 1 : false) {
							data[i + 3][j] = 2
							quantityCounter++
							data[i + 3][j + 1] ? data[i + 3][j + 1] = 0 : false
							if (data[i + 4]) {
								data[i + 4][j] = 0
								data[i + 4][j + 1] ? data[i + 4][j + 1] = 0 : false
							}
						} else {
							if (data[i + 3]) {
								data[i + 3][j] = 0
								data[i + 3][j + 1] ? data[i + 3][j + 1] = 0 : false
							}
						}
					} else {
						if (data[i + 2]) {
							data[i + 2][j] = 0
							data[i + 2][j + 1] ? data[i + 2][j + 1] = 0 : false
						}
					}
				} else {
					data[i][j + 1] ? data[i][j + 1] = 0 : false
					if (data[i + 1]) {
						data[i + 1][j] = 0
						data[i + 1][j + 1] ? data[i + 1][j + 1] = 0 : false
					}
				}

				quantityOfItems[quantityCounter]++
			}

		}
	}

	for (let i = data.length - 1; i < data.length; i++) {
		for (let j = 0; j < data[i].length; j++) {
			if (data[i - 1][j + 1] === 2) {
				data[i][j] = 0
			}
		}
	}

	const result = quantityOfItems[1] + quantityOfItems[2] * 2 + quantityOfItems[3] * 3 + quantityOfItems[4] * 4;

	if (result === 20) {
		return {
			correct: true,
			message: 'DONE! - успешная расстановка',
			quantity: quantityOfItems
		}
	} else {
		return {
			correct: false,
			message: '... продолжайте расстановку',
			quantity: quantityOfItems
		}
	}
}




