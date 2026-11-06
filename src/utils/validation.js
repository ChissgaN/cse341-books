const isNonEmptyString = (value) => {
    return typeof value === 'string' && value.trim() !== '';
};

export { isNonEmptyString };
