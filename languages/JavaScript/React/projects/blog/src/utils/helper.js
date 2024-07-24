
function getDateComponents(date, type="onlyDate") {
    let returnValue;

    const dateObj = new Date(date);

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    returnValue = { year, month, day };

    if(type==="datetime") {
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');

        returnValue = {
            ...returnValue,
            hours, minutes, seconds
        }
    } 

    return returnValue;
}

export function formatDate(date) {
    const { year, month, day } = getDateComponents(date);

    // 포맷팅
    const formattedDate = `${year}년 ${month}월 ${day}일`;

    return formattedDate;
}

export function formatDateTime(date) {
    const { year, month, day, hours, minutes, seconds } = getDateComponents(date, "datetime");

    // 포맷팅
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
}
