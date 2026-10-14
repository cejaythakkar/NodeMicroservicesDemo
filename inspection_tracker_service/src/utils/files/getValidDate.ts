export default function getValidDate(value: string): Date | null {
    const [dayText, monthText, yearText] = value.trim().split("-");

    const day = Number(dayText);
    const month = Number(monthText);
    const year = Number(yearText);

    if (!day || !month || !year) {
        return null;
    }

    const date = new Date(year, month - 1, day);

    const isValidDate =
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;

    if (!isValidDate) {
        return null;
    }

    return date;
}
