
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

export const useGetServices = () => {
	return useQuery({
		queryFn: getServices,
		queryKey: ['services'],
		staleTime: 10000,
		gcTime: 15000,
		select: (data) => data.data,
	});
};

export const useGetServiceById = (id) => {
	return useQuery({
		queryFn: () => getServiceById(id),
		queryKey: ['service', id],
		enabled: !!id,
		select: (data) => data.data,
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
