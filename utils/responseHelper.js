export const responseFormat = (res, statusCode, message, data = null) => {
	const response = {
		status: statusCode >= 200 && statusCode < 300 ? 'success' : 'error',
		message,
		data,
	};
	
	return res.status(statusCode).json(response);
};
