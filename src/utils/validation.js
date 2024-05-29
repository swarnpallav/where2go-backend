function arrayMaxLimit(arr, limit = 10) {
	return arr.length <= limit;
}

function arrayMinLimit(arr, limit = 1) {
	return arr.length >= limit;
}

export { arrayMaxLimit, arrayMinLimit };
