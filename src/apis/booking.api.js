
import axios from 'axios';
import { BASE_URL } from '../config';
import { useMutation, useQuery } from '@tanstack/react-query';

const URL = {
	list: `${BASE_URL}/bookings`,
	add: `${BASE_URL}/bookings`,
	update: (id) => `${BASE_URL}/bookings/${id}`,
	delete: (id) => `${BASE_URL}/bookings/${id}`,
	getById: (id) => `${BASE_URL}/bookings/${id}`,
	getByUser: (userId) => `${BASE_URL}/bookings/user/${userId}`,
};

const getBookings = () => {
	return axios.get(URL.list);
};

const getBookingById = (id) => {
	return axios.get(URL.getById(id));
};

const getBookingsByUser = (userId) => {
	return axios.get(URL.getByUser(userId));
};

const addBooking = (newBooking) => {
	return axios.post(URL.add, newBooking);
};

const updateBooking = ({ id, booking }) => {
	return axios.put(URL.update(id), booking);
};

const deleteBooking = (id) => {
	return axios.delete(URL.delete(id));
};

export const useGetBookings = () => {
	return useQuery({
		queryFn: getBookings,
		queryKey: ['bookings'],
		staleTime: 10000,
		gcTime: 15000,
		select: (data) => data.data,
	});
};

export const useGetBookingsByUser = (userId) => {
	return useQuery({
		queryFn: () => getBookingsByUser(userId),
		queryKey: ['bookings', 'user', userId],
		enabled: !!userId,
		select: (data) => data.data,
	});
};

export const useAddBooking = ({ handleSuccess, handleError }) => {
	return useMutation({
		mutationFn: addBooking,
		mutationKey: ['bookings'],
		onSuccess: (data) => {
			handleSuccess(data);
		},
		onError: (error) => {
			handleError(error);
		},
	});
};

export const useUpdateBooking = ({ handleSuccess, handleError }) => {
	return useMutation({
		mutationFn: updateBooking,
		mutationKey: ['bookings'],
		onSuccess: (data) => {
			handleSuccess(data);
		},
		onError: (error) => {
			handleError(error);
		},
	});
};

export const useDeleteBooking = ({ handleSuccess, handleError }) => {
	return useMutation({
		mutationFn: deleteBooking,
		mutationKey: ['bookings'],
		onSuccess: (data) => {
			handleSuccess(data);
		},
		onError: (error) => {
			handleError(error);
		},
	});
};
