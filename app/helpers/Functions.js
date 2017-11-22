function getMMSSFromMillis(timeInSeconds) {
    const seconds = Math.floor(timeInSeconds % 60)
    const minutes = Math.floor(timeInSeconds / 60)

    const padWithZero = number => {
        if (number < 10) {
            return `0${ number }`
        }
        return `${ number }`
    }
    return padWithZero(minutes) + ':' + padWithZero(seconds)
}

export { getMMSSFromMillis }