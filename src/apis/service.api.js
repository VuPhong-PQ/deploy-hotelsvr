import axios from 'axios';
import { BASE_URL } from '../config';
import { useMutation, useQuery } from '@tanstack/react-query';

const URL = {
	list: `${BASE_URL}/services`,
	add: `${BASE_URL}/services`,
	update: (id) => `${BASE_URL}/services/${id}`,
	delete: (id) => `${BASE_URL}/services/${id}`,
	getById: (id) => `${BASE_URL}/services/${id}`,
};

const getServices = () => {
	return axios.get(URL.list);
};

const getServiceById = (id) => {
	return axios.get(URL.getById(id));
};

const addService = (newService) => {
	return axios.post(URL.add, newService);
};

const updateService = ({ id, service }) => {
	return axios.put(URL.update(id), service);
};

const deleteService = (id) => {
	return axios.delete(URL.delete(id));
};

// React Query Hooks
export const useGetAllServices = () => {
	return useQuery({
		queryKey: ['services'],
		queryFn: async () => {
			const response = await getServices();
			return response.data;
		},
		retry: 1,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useGetServiceById = (id) => {
	return useQuery({
		queryKey: ['services', id],
		queryFn: async () => {
			const response = await getServiceById(id);
			return response.data;
		},
		enabled: !!id,
		retry: 1,
	});
};

export const useAddService = ({ handleSuccess, handleError }) => {
	return useMutation({
		mutationFn: addService,
		mutationKey: ['services'],
		onSuccess: (data) => {
			handleSuccess(data);
		},
		onError: (error) => {
			handleError(error);
		},
	});
};

export const useUpdateService = ({ handleSuccess, handleError }) => {
	return useMutation({
		mutationFn: updateService,
		mutationKey: ['services'],
		onSuccess: (data) => {
			handleSuccess(data);
		},
		onError: (error) => {
			handleError(error);
		},
	});
};

export const useDeleteService = ({ handleSuccess, handleError }) => {
	return useMutation({
		mutationFn: deleteService,
		mutationKey: ['services'],
		onSuccess: (data) => {
			handleSuccess(data);
		},
		onError: (error) => {
			handleError(error);
		},
	});
};
