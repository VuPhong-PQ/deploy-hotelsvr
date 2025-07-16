import axios from 'axios';
import { BASE_URL } from '../config';
import { useMutation, useQuery } from '@tanstack/react-query';

const URL = {
	list: `${BASE_URL}/users`,
	add: `${BASE_URL}/users`,
};

const getUsers = () => {
	return axios.get(URL.list);
};

const addUser = (newUser) => {
	return axios.post(URL.add, newUser);
};

export const useAddUser = ({ handleSuccess, handleError }) => {
	return useMutation({
		mutationFn: addUser,
		mutationKey: ['users'],
		onSuccess: (data) => {
			handleSuccess(data);
		},
		onError: (error) => {
			handleError(error);
		},
	});
};

export const useGetUsers = () => {
	return useQuery({
		queryFn: getUsers,
		queryKey: ['users'],
		staleTime: 10000,
		gcTime: 15000,
		select: (data) => data.data,
	});
};
