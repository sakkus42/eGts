
const cntrlOptions = (src, dest) => {
    if (src && src != 'undefined' && dest && dest != 'undefined'){
        if (src.length <= dest.length){
            return dest.filter(e => !src.includes(e))
        }else if (src.length > dest.length){
            return src.filter(e => !dest.includes(e))
        }
    }
    return [];
};

module.exports = {
    cntrlOptions,
}