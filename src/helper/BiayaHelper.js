export const getBiayaTotal = (listBiaya) => {
    let total = 0;
    listBiaya.forEach(bi => {
        total += parseInt(bi.kbi_total);
    });
    return total;
}
