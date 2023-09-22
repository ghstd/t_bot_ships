document.addEventListener("DOMContentLoaded", () => {
	const btnStart = document.querySelector('.start')
	const btnInvite = document.querySelector('.invite')
	const btnEnd = document.querySelector('.end')
	const fieldResult = document.querySelector('.result')

	btnStart.addEventListener('click', start)
	btnInvite.addEventListener('click', invite)
	btnEnd.addEventListener('click', end)

	const id = Math.floor(Math.random() * 100)
	const name = 'qwertasdfg'[Math.floor(Math.random() * 10)]

	async function start() {
		const response = await fetch(`http://localhost:3000/start?id=${id}&name=${name}`)
		const data = await response.text()
		fieldResult.textContent = data
	}
	async function invite() {
		const response = await fetch(`http://localhost:3000/invite?id=${id}&name=${name}`)
		const data = await response.text()
		fieldResult.innerHTML = `<button>${data}</button>`
	}
	async function end() {
		const response = await fetch('http://localhost:3000/end')
		const data = await response.text()
		fieldResult.textContent = data
	}
})


















