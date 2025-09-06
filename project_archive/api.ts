import axios from 'axios'

// Server address or address of your PC
const instance = axios.create({
	baseURL: 'http://localhost:8081/api'
})

type TCreateUserRequestData = {
	id: string
	budget: number
}

export const createUser = async (data: TCreateUserRequestData) => {
	await instance.post('/user/create', data)
}

export const getUserBudget = async (userId: string) => {
	await instance.get(`/user/budget?userId=${userId}`)
}

type TCreateTransactionRequestData = {
	userId: string
	sum: number
	category: string
	date: string
}

export const createTransaction = async (data: TCreateTransactionRequestData) => {
	await instance.post('/transaction', data)
}

type TFetchTransactionsOnDate = {
	userId: string
	date: string
}

type TFetchTransactionsOnDatePeriod = {
	userId: string
	startDate: string
	endDate: string
}

type TFetchTransactionsRequestData = TFetchTransactionsOnDate | TFetchTransactionsOnDatePeriod;

export const getTransactions = async (data: TFetchTransactionsRequestData) => {
	if ("date" in data) {
		return await instance.get(`/transaction?userId=${data.userId}&date=${data.date}`)
	}
	return await instance.get(`/transaction?userId=${data.userId}&startDate=${data.startDate}&endDate=${data.endDate}`)
}
