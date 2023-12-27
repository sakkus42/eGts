const cntrlOptions = (src, dest) => {
    if (src.length <= dest.length){
        return dest.filter(e => !src.includes(e))
    }
    return src.filter(e => !dest.includes(e))
};

module.exports = {
    cntrlOptions,
}