function koboToNaira(koboAmount) {
    if (typeof koboAmount !== 'number' || isNaN(koboAmount)) {
      return 'Invalid input';
    }
  
    const nairaAmount = koboAmount / 100;
  
    const formattedAmount = `₦ ${nairaAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  
    return formattedAmount;
}
module.exports = koboToNaira;
