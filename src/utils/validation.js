const isNonEmptyString = (value) => {
    return typeof value === 'string' && value.trim() !== '';
};

const isValidDateString = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    // A date such as 2021-02-30 is either invalid or rolls over to another day.
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export { isNonEmptyString, isValidDateString };
